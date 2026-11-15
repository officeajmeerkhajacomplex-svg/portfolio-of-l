import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

/**
 * A crisp, readable Magic UI-style word morph.
 *
 * Two words share the same measured grid cell, so changing word length never
 * shifts the headline. The transition uses a short, subtle blur only while
 * crossfading; each word remains perfectly sharp during its reading interval.
 */
export default function MorphingText({ texts = [], className = '' }) {
  const wrapRef = useRef(null);
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const layers = [firstRef.current, secondRef.current];
    if (!wrap || !layers[0] || !layers[1] || texts.length < 2) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.set(layers[0], { autoAlpha: 1, clearProps: 'filter,transform' });
    gsap.set(layers[1], { autoAlpha: 0, clearProps: 'filter,transform' });
    if (reducedMotion) return undefined;

    let activeLayer = 0;
    let wordIndex = 0;
    let delayCall = null;
    let transition = null;

    const showNextWord = () => {
      const nextLayer = 1 - activeLayer;
      wordIndex = (wordIndex + 1) % texts.length;

      // Set content only on the hidden layer. No layout measurement or reflow.
      layers[nextLayer].textContent = texts[wordIndex];
      gsap.set(layers[nextLayer], {
        autoAlpha: 0,
        y: 3,
        filter: 'blur(1px)',
      });

      transition = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          gsap.set(layers[activeLayer], {
            autoAlpha: 0,
            clearProps: 'filter,transform',
          });
          gsap.set(layers[nextLayer], {
            autoAlpha: 1,
            clearProps: 'filter,transform',
          });
          activeLayer = nextLayer;
          delayCall = gsap.delayedCall(2.35, showNextWord);
        },
      });

      // Short, restrained dissolve: avoid the heavy blur that made the glyphs
      // merge into illegible shapes in the previous implementation.
      transition
        .to(layers[activeLayer], {
          autoAlpha: 0,
          y: -2,
          filter: 'blur(1px)',
          duration: 0.24,
        }, 0)
        .to(layers[nextLayer], {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.32,
        }, 0.04);
    };

    delayCall = gsap.delayedCall(2.4, showNextWord);

    return () => {
      delayCall?.kill();
      transition?.kill();
      gsap.killTweensOf(layers);
      gsap.set(layers, { clearProps: 'all' });
    };
  }, [texts]);

  const widestWord = texts.reduce(
    (widest, word) => word.length >= widest.length ? word : widest,
    '',
  );

  return (
    <span className={'morphing-text ' + className} ref={wrapRef} aria-hidden="true">
      <span className="morphing-text__sizer" aria-hidden="true">{widestWord}</span>
      <span className="morphing-text__layer" ref={firstRef}>{texts[0] || ''}</span>
      <span className="morphing-text__layer" ref={secondRef}>{texts[1] || texts[0] || ''}</span>
    </span>
  );
}
