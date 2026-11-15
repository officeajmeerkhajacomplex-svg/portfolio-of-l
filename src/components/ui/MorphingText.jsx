import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { TextAnimate } from './TextAnimate';

/**
 * A crisp, readable word rotator with Magic UI's character-by-character
 * blurInUp entrance. GSAP still controls the timed crossfade between words.
 */
export function MorphingText({ texts = [], className = '' }) {
  const wrapRef = useRef(null);
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const delayRef = useRef(null);
  const timelineRef = useRef(null);
  const activeLayerRef = useRef(0);
  const wordIndexRef = useRef(0);
  const sequenceRef = useRef(0);
  const textsRef = useRef(texts);

  const [layerWords, setLayerWords] = useState(() => [
    texts[0] || '',
    texts[1] || texts[0] || '',
  ]);
  const [layerVersions, setLayerVersions] = useState([0, -1]);
  const [pendingTransition, setPendingTransition] = useState(null);

  textsRef.current = texts;

  const advanceRef = useRef(null);
  advanceRef.current = () => {
    const currentTexts = textsRef.current;
    if (!currentTexts || currentTexts.length < 2) return;

    const nextWordIndex = (wordIndexRef.current + 1) % currentTexts.length;
    const nextLayer = 1 - activeLayerRef.current;
    const nextSequence = ++sequenceRef.current;

    wordIndexRef.current = nextWordIndex;
    setLayerWords((current) => {
      const next = [...current];
      next[nextLayer] = currentTexts[nextWordIndex];
      return next;
    });
    setLayerVersions((current) => {
      const next = [...current];
      next[nextLayer] = nextSequence;
      return next;
    });
    setPendingTransition({ nextLayer, sequence: nextSequence });
  };

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const layers = [firstRef.current, secondRef.current];
    if (!wrap || !layers[0] || !layers[1] || texts.length < 2) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeLayerRef.current = 0;
    wordIndexRef.current = 0;
    sequenceRef.current = 0;
    setPendingTransition(null);

    gsap.set(layers[0], { autoAlpha: 1, clearProps: 'filter,transform' });
    gsap.set(layers[1], { autoAlpha: 0, clearProps: 'filter,transform' });

    if (reducedMotion) return undefined;

    delayRef.current = gsap.delayedCall(2.4, () => advanceRef.current?.());

    return () => {
      delayRef.current?.kill();
      timelineRef.current?.kill();
      gsap.killTweensOf(layers);
      gsap.set(layers, { clearProps: 'all' });
    };
  }, [texts]);

  useLayoutEffect(() => {
    if (!pendingTransition) return undefined;

    const layers = [firstRef.current, secondRef.current];
    const activeLayer = activeLayerRef.current;
    const nextLayer = pendingTransition.nextLayer;
    const current = layers[activeLayer];
    const next = layers[nextLayer];
    if (!current || !next) return undefined;

    gsap.set(next, { autoAlpha: 0, y: 3, clearProps: 'filter' });

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        gsap.set(current, { autoAlpha: 0, clearProps: 'filter,transform' });
        gsap.set(next, { autoAlpha: 1, clearProps: 'filter,transform' });
        activeLayerRef.current = nextLayer;
        setPendingTransition(null);
        delayRef.current = gsap.delayedCall(2.35, () => advanceRef.current?.());
      },
    });

    timelineRef.current = timeline;
    timeline
      .to(current, { autoAlpha: 0, y: -2, duration: 0.24 }, 0)
      .to(next, { autoAlpha: 1, y: 0, duration: 0.32 }, 0.04);

    return () => timeline.kill();
  }, [pendingTransition]);

  const widestWord = texts.reduce(
    (widest, word) => word.length >= widest.length ? word : widest,
    '',
  );

  return (
    <span className={'morphing-text ' + className} ref={wrapRef} aria-hidden="true">
      <span className="morphing-text__sizer" aria-hidden="true">{widestWord}</span>
      <span className="morphing-text__layer" ref={firstRef}>
        <TextAnimate
          key={'word-0-' + layerVersions[0]}
          as="span"
          animation="blurInUp"
          by="character"
          once
          startOnView={false}
          className="morphing-text__animated-word"
        >
          {layerWords[0]}
        </TextAnimate>
      </span>
      <span className="morphing-text__layer" ref={secondRef}>
        {layerVersions[1] < 0 ? (
          layerWords[1]
        ) : (
          <TextAnimate
            key={'word-1-' + layerVersions[1]}
            as="span"
            animation="blurInUp"
            by="character"
            once
            startOnView={false}
            className="morphing-text__animated-word"
          >
            {layerWords[1]}
          </TextAnimate>
        )}
      </span>
    </span>
  );
}

export default MorphingText;
