import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '../lib/gsap';

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
      let hasPosition = false;
      const quickPair = (node, duration) => ({
        x: gsap.quickTo(node, 'x', { duration, ease: 'power3.out' }),
        y: gsap.quickTo(node, 'y', { duration, ease: 'power3.out' }),
      });
      const ringTo = quickPair(ring, 0.13);
      const trailTo = quickPair(trail, 0.3);
      const dotTo = quickPair(dot, 0.055);

      gsap.set([trail, ring, dot], { xPercent: -50, yPercent: -50 });
      gsap.set(root, { autoAlpha: 0 });
      gsap.set(label, { autoAlpha: 0, scale: 0.78 });

      const onMove = (event) => {
        if (event.pointerType && event.pointerType !== 'mouse') return;
        if (!hasPosition) {
          gsap.set([trail, ring, dot], { x: event.clientX, y: event.clientY });
          gsap.set(root, { autoAlpha: 1 });
          hasPosition = true;
          return;
        }
        ringTo.x(event.clientX); ringTo.y(event.clientY);
        trailTo.x(event.clientX); trailTo.y(event.clientY);
        dotTo.x(event.clientX); dotTo.y(event.clientY);
      };

      const selector = '[data-cursor], [data-cursor-project], a, button, [role="button"], input, textarea, select, summary';
      const onOver = (event) => {
        const target = event.target?.closest?.(selector);
        if (!target) return;
        const isProject = target.hasAttribute('data-cursor-project');
        label.textContent = target.getAttribute('data-cursor') || (isProject ? 'VIEW' : 'OPEN');
        gsap.to(ring, { scale: isProject ? 1.8 : 1.28, borderColor: 'rgba(201,67,50,.9)', backgroundColor: isProject ? 'rgba(255,248,241,.76)' : 'rgba(255,248,241,.38)', duration: 0.24, overwrite: true });
        gsap.to(trail, { scale: isProject ? 1.45 : 1.12, duration: 0.3, overwrite: true });
        gsap.to(dot, { scale: isProject ? 0.4 : 0.8, duration: 0.18, overwrite: true });
        gsap.to(label, { autoAlpha: isProject ? 1 : 0, scale: 1, duration: 0.2, overwrite: true });
      };

      const onOut = (event) => {
        const from = event.target?.closest?.(selector);
        const to = event.relatedTarget?.closest?.(selector);
        if (!from || (to && from === to)) return;
        gsap.to(ring, { scale: 1, borderColor: 'rgba(201,67,50,.58)', backgroundColor: 'rgba(255,248,241,.12)', duration: 0.26, overwrite: true });
        gsap.to(trail, { scale: 1, duration: 0.3, overwrite: true });
        gsap.to(dot, { scale: 1, duration: 0.18, overwrite: true });
        gsap.to(label, { autoAlpha: 0, scale: 0.78, duration: 0.14, overwrite: true });
      };

      const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.1, overwrite: true });
      const onUp = () => gsap.to(ring, { scale: 1, duration: 0.22, ease: 'back.out(2)', overwrite: true });
      const onLeave = () => {
        hasPosition = false;
        gsap.to(root, { autoAlpha: 0, duration: 0.16, overwrite: true });
      };

      document.documentElement.classList.add('has-gsap-cursor');
      document.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver);
      document.addEventListener('pointerout', onOut);
      document.addEventListener('pointerdown', onDown);
      document.addEventListener('pointerup', onUp);
      window.addEventListener('blur', onLeave);
      document.addEventListener('mouseleave', onLeave);
      return () => {
        document.documentElement.classList.remove('has-gsap-cursor');
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.removeEventListener('pointerout', onOut);
        document.removeEventListener('pointerdown', onDown);
        document.removeEventListener('pointerup', onUp);
        window.removeEventListener('blur', onLeave);
        document.removeEventListener('mouseleave', onLeave);
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
