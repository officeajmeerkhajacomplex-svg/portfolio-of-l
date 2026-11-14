import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

/**
 * A LIYAQAT-tuned Magic Card pattern. GSAP smooths the pointer-following
 * spotlight while the card surface stays fully semantic and keyboard friendly.
 */
export default function MagicCard({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    gsap.set(node, { '--magic-x': '50%', '--magic-y': '50%' });
    const moveX = gsap.quickTo(node, '--magic-x', { duration: 0.28, ease: 'power3.out' });
    const moveY = gsap.quickTo(node, '--magic-y', { duration: 0.28, ease: 'power3.out' });

    const handlePointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      const bounds = node.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      moveX(`${x}%`);
      moveY(`${y}%`);
      node.classList.add('is-active');
    };

    const handlePointerLeave = () => {
      moveX('50%');
      moveY('50%');
      node.classList.remove('is-active');
    };

    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerleave', handlePointerLeave);
      node.classList.remove('is-active');
      gsap.killTweensOf(node);
    };
  }, []);

  return (
    <div ref={ref} className={`magic-card ${className}`}>
      <div className="magic-card__surface">{children}</div>
    </div>
  );
}
