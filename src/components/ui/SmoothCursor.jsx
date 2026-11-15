import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useSpring } from 'framer-motion';

const DESKTOP_POINTER_QUERY = '(any-hover: hover) and (any-pointer: fine)';
const DEFAULT_SPRING = {
  damping: 45,
  stiffness: 400,
  mass: 1,
  restDelta: 0.001,
};

function isTrackablePointer(pointerType) {
  return pointerType !== 'touch';
}

/**
 * Magic UI SmoothCursor, adapted to LIYAQAT's coral / warm-paper palette.
 * The cursor is portalled to document.body so transformed page transitions,
 * clipped sections and route wrappers cannot trap its fixed positioning.
 *
 * This project already uses framer-motion, which exposes the same motion
 * primitives used by the current Magic UI implementation.
 */
function LiyaqatCursor() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="54"
      viewBox="0 0 50 54"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{
        display: 'block',
        width: 31,
        height: 34,
        overflow: 'visible',
      }}
    >
      <g filter="url(#liyaqat-cursor-shadow)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="#C94332"
          stroke="#FFF9F3"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 39.7L24.55 15.7L35.3 39.65"
          stroke="#FFB7A9"
          strokeWidth="1.65"
          strokeLinecap="round"
          opacity=".82"
        />
      </g>
      <defs>
        <filter
          id="liyaqat-cursor-shadow"
          x="0.6"
          y="0.95"
          width="49.1"
          height="52.5"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#20221E" floodOpacity=".24" />
        </filter>
      </defs>
    </svg>
  );
}

export default function SmoothCursor({
  cursor = <LiyaqatCursor />,
  springConfig = DEFAULT_SPRING,
}) {
  const lastMousePos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastUpdateTime = useRef(0);
  const hasPreviousPosition = useRef(false);
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  });
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  });

  // Enable on mouse / trackpad, including a mouse connected to a touch laptop.
  // Respect reduced motion and respond when input devices are connected/removed.
  useEffect(() => {
    const pointerQuery = window.matchMedia(DESKTOP_POINTER_QUERY);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateEnabled = () => {
      const enabled = pointerQuery.matches && !motionQuery.matches;
      setIsEnabled(enabled);
      if (!enabled) {
        setIsVisible(false);
        hasPreviousPosition.current = false;
        document.documentElement.classList.remove('has-smooth-cursor');
      }
    };

    updateEnabled();
    pointerQuery.addEventListener('change', updateEnabled);
    motionQuery.addEventListener('change', updateEnabled);

    return () => {
      pointerQuery.removeEventListener('change', updateEnabled);
      motionQuery.removeEventListener('change', updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return undefined;

    let rafId = 0;
    let releaseTimeout = null;

    const updateVelocity = (currentPos) => {
      const currentTime = performance.now();

      // First event seeds position only; do not calculate a wild angle from 0,0.
      if (!hasPreviousPosition.current) {
        lastMousePos.current = currentPos;
        lastUpdateTime.current = currentTime;
        velocity.current = { x: 0, y: 0 };
        hasPreviousPosition.current = true;
        return;
      }

      const deltaTime = currentTime - lastUpdateTime.current;
      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        };
      }

      lastUpdateTime.current = currentTime;
      lastMousePos.current = currentPos;
    };

    const smoothPointerMove = (pointer) => {
      const currentPos = { x: pointer.x, y: pointer.y };
      updateVelocity(currentPos);

      cursorX.set(currentPos.x);
      cursorY.set(currentPos.y);
      setIsVisible(true);
      document.documentElement.classList.add('has-smooth-cursor');

      const speed = Math.hypot(velocity.current.x, velocity.current.y);
      if (speed > 0.1) {
        const currentAngle =
          (Math.atan2(velocity.current.y, velocity.current.x) * 180) / Math.PI + 90;

        let angleDiff = currentAngle - previousAngle.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;

        accumulatedRotation.current += angleDiff;
        rotation.set(accumulatedRotation.current);
        previousAngle.current = currentAngle;

        scale.set(0.95);
        if (releaseTimeout !== null) window.clearTimeout(releaseTimeout);
        releaseTimeout = window.setTimeout(() => scale.set(1), 150);
      }
    };

    const onPointerMove = (event) => {
      if (!isTrackablePointer(event.pointerType)) return;
      const pointer = {
        x: event.clientX,
        y: event.clientY,
      };

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        smoothPointerMove(pointer);
        rafId = 0;
      });
    };

    const hideCursor = () => {
      setIsVisible(false);
      document.documentElement.classList.remove('has-smooth-cursor');
      hasPreviousPosition.current = false;
      velocity.current = { x: 0, y: 0 };
      if (releaseTimeout !== null) {
        window.clearTimeout(releaseTimeout);
        releaseTimeout = null;
      }
      scale.set(1);
    };

    const onVisibilityChange = () => {
      if (document.hidden) hideCursor();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true, capture: true });
    window.addEventListener('blur', hideCursor);
    document.documentElement.addEventListener('pointerleave', hideCursor);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('blur', hideCursor);
      document.documentElement.removeEventListener('pointerleave', hideCursor);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.documentElement.classList.remove('has-smooth-cursor');
      if (rafId) cancelAnimationFrame(rafId);
      if (releaseTimeout !== null) window.clearTimeout(releaseTimeout);
    };
  }, [cursorX, cursorY, rotation, scale, isEnabled]);

  if (!isEnabled) return null;

  return createPortal(
    <motion.div
      className="liyaqat-smooth-cursor"
      style={{
        position: 'fixed',
        left: cursorX,
        top: cursorY,
        x: '-50%',
        y: '-50%',
        rotate: rotation,
        scale,
        zIndex: 2147483647,
        pointerEvents: 'none',
        willChange: 'transform',
        opacity: isVisible ? 1 : 0,
      }}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.12 }}
      aria-hidden="true"
    >
      {cursor}
    </motion.div>,
    document.body,
  );
}
