import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

export default function PageTransition({ children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo(node,
        { autoAlpha: 0, y: 12, filter: 'blur(3px)', clipPath: 'inset(0 0 5% 0)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0% 0)', duration: 0.52, ease: 'power3.out', clearProps: 'filter,clipPath' }
      );
    }, node);
    return () => context.revert();
  }, []);

  return <div ref={ref} className="page-transition">{children}</div>;
}
