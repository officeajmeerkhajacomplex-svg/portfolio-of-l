import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

/**
 * Magic UI-inspired gooey morph, orchestrated with GSAP.
 * The two live layers overlap through an SVG alpha-threshold filter.
 */
export default function MorphingText({ texts = [], className = '' }) {
  const wrapRef = useRef(null);
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const layers = [firstRef.current, secondRef.current];
    if (!wrap || !layers[0] || !layers[1] || texts.length < 2) return undefined;

    let active = 0;
    let wordIndex = 0;
    let pause;

    gsap.set(layers[0], { autoAlpha: 1, filter: 'blur(0px)', scale: 1, y: 0 });
    gsap.set(layers[1], { autoAlpha: 0, filter: 'blur(12px)', scale: 0.96, y: 8 });

    const advance = () => {
      const next = 1 - active;
      wordIndex = (wordIndex + 1) % texts.length;
      layers[next].textContent = texts[wordIndex];
      gsap.set(layers[next], { autoAlpha: 0, filter: 'blur(12px)', scale: 0.96, y: 8 });

      gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          gsap.set(layers[active], { autoAlpha: 0, clearProps: 'filter,transform' });
          active = next;
          pause = gsap.delayedCall(1.65, advance);
        },
      })
        .to(layers[active], { autoAlpha: 0, filter: 'blur(12px)', scale: 1.035, y: -5, duration: 0.48 }, 0)
        .to(layers[next], { autoAlpha: 1, filter: 'blur(0px)', scale: 1, y: 0, duration: 0.68 }, 0.08);
    };

    pause = gsap.delayedCall(2.1, advance);
    return () => {
      pause?.kill();
      gsap.killTweensOf(layers);
    };
  }, [texts]);

  return (
    <span className={`morphing-text ${className}`} ref={wrapRef} aria-hidden="true">
      <svg className="morphing-text__filter" aria-hidden="true" focusable="false">
        <defs>
          <filter id="morphing-text-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <span className="morphing-text__sizer">{texts[4] || texts.reduce((longest, word) => word.length > longest.length ? word : longest, '')}</span>
      <span className="morphing-text__layer" ref={firstRef}>{texts[0]}</span>
      <span className="morphing-text__layer" ref={secondRef}>{texts[1]}</span>
    </span>
  );
}
