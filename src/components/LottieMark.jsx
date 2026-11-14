import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const Lottie = lazy(() => import('./LightLottiePlayer'));

export default function LottieMark({ src, className = '' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return undefined;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { rootMargin: '120px' });

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div ref={ref} className={`lottie-mark ${className}`} aria-hidden="true">
      {isVisible && !reduceMotion ? (
        <Suspense fallback={<span className="lottie-mark-fallback">✳</span>}>
          <Lottie
            src={src}
            autoplay
            loop={false}
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet', progressiveLoad: true }}
          />
        </Suspense>
      ) : (
        <span className="lottie-mark-fallback">✳</span>
      )}
    </div>
  );
}
