import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

/**
 * A desktop-only cursor companion. The native cursor remains untouched on
 * touch/coarse pointers and whenever reduced motion is requested.
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
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;

      gsap.set(root, { autoAlpha: 0 });
      gsap.set([trail, ring, dot], {
        xPercent: -50,
        yPercent: -50,
        x: startX,
        y: startY,
      });
      gsap.set(label, { autoAlpha: 0, scale: 0.78 });

      const ringX = gsap.quickTo(ring, 'x', { duration: 0.19, ease: 'power3.out' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.19, ease: 'power3.out' });
      const trailX = gsap.quickTo(trail, 'x', { duration: 0.34, ease: 'power2.out' });
      const trailY = gsap.quickTo(trail, 'y', { duration: 0.34, ease: 'power2.out' });
      const dotX = gsap.quickTo(dot, 'x', { duration: 0.075, ease: 'power2.out' });
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.075, ease: 'power2.out' });

      const show = () => gsap.to(root, { autoAlpha: 1, duration: 0.18, overwrite: true });
      const hide = () => gsap.to(root, { autoAlpha: 0, duration: 0.22, overwrite: true });

      const onMove = (event) => {
        if (event.pointerType && event.pointerType !== 'mouse') return;
        ringX(event.clientX);
        ringY(event.clientY);
        trailX(event.clientX);
        trailY(event.clientY);
        dotX(event.clientX);
        dotY(event.clientY);
        show();
      };

      const onOver = (event) => {
        const target = event.target?.closest?.('[data-cursor], a, button, [role="button"], input, textarea, select, summary');
        if (!target) return;

        const isProject = target.hasAttribute('data-cursor-project');
        const text = target.getAttribute('data-cursor') || (isProject ? 'VIEW PROJECT' : 'OPEN');
        label.textContent = text;

        gsap.to(ring, {
          scale: isProject ? 1.95 : 1.38,
          borderColor: isProject ? 'rgba(255, 98, 77, 0.95)' : 'rgba(255, 98, 77, 0.72)',
          backgroundColor: isProject ? 'rgba(255, 248, 241, 0.72)' : 'rgba(255, 248, 241, 0.34)',
          duration: 0.28,
          ease: 'power3.out',
          overwrite: true,
        });
        gsap.to(trail, { scale: isProject ? 1.55 : 1.18, duration: 0.32, ease: 'power3.out', overwrite: true });
        gsap.to(dot, { scale: isProject ? 0.45 : 0.8, duration: 0.2, ease: 'power2.out', overwrite: true });
        gsap.to(label, { autoAlpha: isProject ? 1 : 0, scale: 1, duration: 0.22, ease: 'power2.out', overwrite: true });
      };

      const onOut = (event) => {
        const next = event.relatedTarget?.closest?.('[data-cursor], a, button, [role="button"], input, textarea, select, summary');
        if (next) return;
        gsap.to(ring, { scale: 1, borderColor: 'rgba(255, 98, 77, 0.62)', backgroundColor: 'rgba(255, 248, 241, 0.12)', duration: 0.32, ease: 'power3.out', overwrite: true });
        gsap.to(trail, { scale: 1, duration: 0.36, ease: 'power3.out', overwrite: true });
        gsap.to(dot, { scale: 1, duration: 0.2, ease: 'power2.out', overwrite: true });
        gsap.to(label, { autoAlpha: 0, scale: 0.78, duration: 0.14, overwrite: true });
      };

      const onDown = () => gsap.to(ring, { scale: 0.86, duration: 0.12, ease: 'power2.out', overwrite: true });
      const onUp = () => gsap.to(ring, { scale: 1, duration: 0.24, ease: 'back.out(2)', overwrite: true });
      const onViewportLeave = (event) => {
        if (!event.relatedTarget) hide();
      };

      document.documentElement.classList.add('has-gsap-cursor');
      document.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver);
      document.addEventListener('pointerout', onOut);
      document.addEventListener('pointerdown', onDown);
      document.addEventListener('pointerup', onUp);
      window.addEventListener('pointerout', onViewportLeave);

      return () => {
        document.documentElement.classList.remove('has-gsap-cursor');
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.removeEventListener('pointerout', onOut);
        document.removeEventListener('pointerdown', onDown);
        document.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointerout', onViewportLeave);
        gsap.killTweensOf([root, trail, ring, dot, label]);
      };
    });

    return () => media.revert();
  }, []);

  return (
    <div className="custom-cursor" ref={rootRef} aria-hidden="true">
      <span className="custom-cursor__trail" ref={trailRef} />
      <span className="custom-cursor__ring" ref={ringRef}>
        <span className="custom-cursor__label" ref={labelRef} />
      </span>
      <span className="custom-cursor__dot" ref={dotRef} />
    </div>
  );
}
