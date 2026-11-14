import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

export default function GsapMagnetic({ children, strength = 0.18, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return undefined;

    const moveX = gsap.quickTo(node, 'x', { duration: 0.45, ease: 'power3.out' });
    const moveY = gsap.quickTo(node, 'y', { duration: 0.45, ease: 'power3.out' });
    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      moveX((event.clientX - rect.left - rect.width / 2) * strength);
      moveY((event.clientY - rect.top - rect.height / 2) * strength);
    };
    const reset = () => {
      moveX(0);
      moveY(0);
    };
    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', reset);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', reset);
      gsap.killTweensOf(node);
    };
  }, [strength]);

  return <span ref={ref} className={className}>{children}</span>;
}
