import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '../lib/gsap';

const INTERACTIVE_TARGETS = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'summary',
  'label',
  '[role="button"]',
  '[role="link"]',
  '[data-cursor]',
  '[data-cursor-project]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  '[onclick]',
].join(',');

/**
 * One app-level cursor layer for every route and every page surface.
 * The cursor is portalled to body to escape transformed and clipped app shells.
 */
export default function CustomCursor() {
  const rootRef = useRef(null);
  const trailRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const trail = trailRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!root || !trail || !ring || !dot || !label) return undefined;

    const media = gsap.matchMedia();
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      let positioned = false;
      let activeTarget = null;

      const quickPair = (node, duration) => ({
        x: gsap.quickTo(node, 'x', { duration, ease: 'power3.out' }),
        y: gsap.quickTo(node, 'y', { duration, ease: 'power3.out' }),
      });

      const ringTo = quickPair(ring, 0.12);
      const trailTo = quickPair(trail, 0.28);
      const dotTo = quickPair(dot, 0.045);

      gsap.set([trail, ring, dot], {
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        force3D: true,
      });
      gsap.set(root, { autoAlpha: 0 });
      gsap.set(label, { autoAlpha: 0, scale: 0.78 });

      const moveLayer = (x, y) => {
        if (!positioned) {
          // Never reveal an uninitialised layer at the viewport centre.
          gsap.set([trail, ring, dot], { x, y });
          gsap.set(root, { autoAlpha: 1 });
          positioned = true;
          return;
        }
        ringTo.x(x);
        ringTo.y(y);
        trailTo.x(x);
        trailTo.y(y);
        dotTo.x(x);
        dotTo.y(y);
      };

      const onPointerMove = (event) => {
        if (event.pointerType === 'touch') return;
        moveLayer(event.clientX, event.clientY);
      };

      const resetHover = () => {
        activeTarget = null;
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(201,67,50,.58)',
          backgroundColor: 'rgba(255,248,241,.12)',
          duration: 0.24,
          overwrite: true,
        });
        gsap.to(trail, { scale: 1, duration: 0.28, overwrite: true });
        gsap.to(dot, { scale: 1, duration: 0.16, overwrite: true });
        gsap.to(label, { autoAlpha: 0, scale: 0.78, duration: 0.14, overwrite: true });
      };

      const onPointerOver = (event) => {
        const target = event.target?.closest?.(INTERACTIVE_TARGETS);
        if (!target || target === activeTarget) return;

        activeTarget = target;
        const isProject = target.hasAttribute('data-cursor-project');
        const copy = target.getAttribute('data-cursor') || (isProject ? 'VIEW' : 'OPEN');
        label.textContent = copy;

        gsap.to(ring, {
          scale: isProject ? 1.82 : 1.3,
          borderColor: 'rgba(201,67,50,.94)',
          backgroundColor: isProject ? 'rgba(255,248,241,.8)' : 'rgba(255,248,241,.42)',
          duration: 0.22,
          ease: 'power3.out',
          overwrite: true,
        });
        gsap.to(trail, { scale: isProject ? 1.5 : 1.14, duration: 0.28, overwrite: true });
        gsap.to(dot, { scale: isProject ? 0.42 : 0.78, duration: 0.16, overwrite: true });
        gsap.to(label, {
          autoAlpha: isProject || target.hasAttribute('data-cursor') ? 1 : 0,
          scale: 1,
          duration: 0.2,
          overwrite: true,
        });
      };

      const onPointerOut = (event) => {
        // Moving among children of the same interactive element is not a leave.
        const from = event.target?.closest?.(INTERACTIVE_TARGETS);
        const to = event.relatedTarget?.closest?.(INTERACTIVE_TARGETS);
        if (from && from === to) return;
        if (from && from === activeTarget && !to) resetHover();

        // Leaving the browser window hides the layer. The next entry seeds it anew.
        if (!event.relatedTarget) {
          positioned = false;
          gsap.to(root, { autoAlpha: 0, duration: 0.12, overwrite: true });
          resetHover();
        }
      };

      const onPointerDown = () => gsap.to(ring, { scale: 0.82, duration: 0.1, overwrite: true });
      const onPointerUp = () => gsap.to(ring, { scale: activeTarget ? 1.3 : 1, duration: 0.2, ease: 'back.out(2)', overwrite: true });
      const onWindowBlur = () => {
        positioned = false;
        gsap.to(root, { autoAlpha: 0, duration: 0.12, overwrite: true });
        resetHover();
      };

      document.documentElement.classList.add('has-gsap-cursor');
      // Window-level tracking means route transitions and nested page content
      // cannot accidentally detach the listener from the active surface.
      window.addEventListener('pointermove', onPointerMove, { passive: true, capture: true });
      document.addEventListener('pointerover', onPointerOver, true);
      document.addEventListener('pointerout', onPointerOut, true);
      window.addEventListener('pointerdown', onPointerDown, true);
      window.addEventListener('pointerup', onPointerUp, true);
      window.addEventListener('pointercancel', onPointerUp, true);
      window.addEventListener('blur', onWindowBlur);

      return () => {
        document.documentElement.classList.remove('has-gsap-cursor');
        window.removeEventListener('pointermove', onPointerMove, true);
        document.removeEventListener('pointerover', onPointerOver, true);
        document.removeEventListener('pointerout', onPointerOut, true);
        window.removeEventListener('pointerdown', onPointerDown, true);
        window.removeEventListener('pointerup', onPointerUp, true);
        window.removeEventListener('pointercancel', onPointerUp, true);
        window.removeEventListener('blur', onWindowBlur);
        gsap.killTweensOf([root, trail, ring, dot, label]);
      };
    });

    return () => media.revert();
  }, []);

  return createPortal(
    <div className="custom-cursor" ref={rootRef} aria-hidden="true">
      <span className="custom-cursor__trail" ref={trailRef} />
      <span className="custom-cursor__ring" ref={ringRef}>
        <span className="custom-cursor__label" ref={labelRef} />
      </span>
      <span className="custom-cursor__dot" ref={dotRef} />
    </div>,
    document.body,
  );
}
