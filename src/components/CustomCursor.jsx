import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '../lib/gsap';

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'textarea:not(:disabled)',
  'select:not(:disabled)',
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
 * Global GSAP cursor for every route.
 *
 * The ring and centre dot use GSAP quickSetter for exact pointer tracking.
 * Only the outer halo is eased with quickTo, creating the trailing effect
 * without making the actual cursor feel detached from the pointer.
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

    // any-pointer also covers laptops/tablets with a connected mouse.
    media.add('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      let visible = false;
      let activeTarget = null;

      // Positioning is deliberately GSAP-only: no React state or DOM layout
      // reads are needed for the movement path.
      const ringX = gsap.quickSetter(ring, 'x', 'px');
      const ringY = gsap.quickSetter(ring, 'y', 'px');
      const dotX = gsap.quickSetter(dot, 'x', 'px');
      const dotY = gsap.quickSetter(dot, 'y', 'px');
      const trailX = gsap.quickTo(trail, 'x', { duration: 0.26, ease: 'power3.out' });
      const trailY = gsap.quickTo(trail, 'y', { duration: 0.26, ease: 'power3.out' });

      gsap.set([trail, ring, dot], {
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        force3D: true,
      });
      gsap.set(root, { autoAlpha: 0 });
      gsap.set(label, { autoAlpha: 0, scale: 0.82 });

      const revealAt = (x, y) => {
        // Set all positions before hiding the native cursor/revealing the custom one.
        ringX(x);
        ringY(y);
        dotX(x);
        dotY(y);
        gsap.set(trail, { x, y });
        gsap.set(root, { autoAlpha: 1 });
        document.documentElement.classList.add('has-gsap-cursor');
        visible = true;
      };

      const resetHover = () => {
        activeTarget = null;
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(201,67,50,.58)',
          backgroundColor: 'rgba(255,248,241,.1)',
          duration: 0.22,
          ease: 'power3.out',
          overwrite: true,
        });
        gsap.to(trail, { scale: 1, duration: 0.26, overwrite: true });
        gsap.to(dot, { scale: 1, duration: 0.16, overwrite: true });
        gsap.to(label, { autoAlpha: 0, scale: 0.82, duration: 0.14, overwrite: true });
      };

      const setHoverTarget = (target) => {
        const nextTarget = target?.closest?.(INTERACTIVE_SELECTOR) || null;
        if (nextTarget === activeTarget) return;

        activeTarget = nextTarget;
        if (!nextTarget) {
          resetHover();
          return;
        }

        const isProject = nextTarget.hasAttribute('data-cursor-project');
        const customLabel = nextTarget.getAttribute('data-cursor');
        label.textContent = customLabel || (isProject ? 'VIEW' : 'OPEN');

        gsap.to(ring, {
          scale: isProject ? 1.78 : 1.24,
          borderColor: 'rgba(201,67,50,.96)',
          backgroundColor: isProject ? 'rgba(255,248,241,.78)' : 'rgba(255,248,241,.38)',
          duration: 0.2,
          ease: 'power3.out',
          overwrite: true,
        });
        gsap.to(trail, { scale: isProject ? 1.42 : 1.12, duration: 0.26, overwrite: true });
        gsap.to(dot, { scale: isProject ? 0.4 : 0.8, duration: 0.16, overwrite: true });
        gsap.to(label, {
          autoAlpha: isProject || Boolean(customLabel) ? 1 : 0,
          scale: 1,
          duration: 0.18,
          overwrite: true,
        });
      };

      const onPointerMove = (event) => {
        // Ignore touch-generated pointer events; pen and mouse remain supported.
        if (event.pointerType === 'touch') return;
        const x = event.clientX;
        const y = event.clientY;

        if (!visible) {
          revealAt(x, y);
        } else {
          ringX(x);
          ringY(y);
          dotX(x);
          dotY(y);
          trailX(x);
          trailY(y);
        }

        // Resolve hover from the actual hit-tested element. This stays correct
        // when React swaps pages under a stationary pointer or elements rerender.
        setHoverTarget(document.elementFromPoint(x, y));
      };

      const hide = () => {
        if (!visible) return;
        visible = false;
        document.documentElement.classList.remove('has-gsap-cursor');
        gsap.to(root, { autoAlpha: 0, duration: 0.12, overwrite: true });
        resetHover();
      };

      const onPointerDown = () => gsap.to(ring, { scale: 0.82, duration: 0.1, ease: 'power2.out', overwrite: true });
      const onPointerUp = () => gsap.to(ring, {
        scale: activeTarget ? 1.24 : 1,
        duration: 0.2,
        ease: 'back.out(2)',
        overwrite: true,
      });
      const onVisibilityChange = () => {
        if (document.hidden) hide();
      };

      // Do not suppress the native cursor until the custom one has a real,
      // current pointer coordinate. This prevents the "invisible cursor" bug.
      window.addEventListener('pointermove', onPointerMove, { passive: true, capture: true });
      window.addEventListener('pointerdown', onPointerDown, true);
      window.addEventListener('pointerup', onPointerUp, true);
      window.addEventListener('pointercancel', onPointerUp, true);
      window.addEventListener('blur', hide);
      document.documentElement.addEventListener('mouseleave', hide);
      document.addEventListener('visibilitychange', onVisibilityChange);

      return () => {
        document.documentElement.classList.remove('has-gsap-cursor');
        window.removeEventListener('pointermove', onPointerMove, true);
        window.removeEventListener('pointerdown', onPointerDown, true);
        window.removeEventListener('pointerup', onPointerUp, true);
        window.removeEventListener('pointercancel', onPointerUp, true);
        window.removeEventListener('blur', hide);
        document.documentElement.removeEventListener('mouseleave', hide);
        document.removeEventListener('visibilitychange', onVisibilityChange);
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
