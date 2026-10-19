import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lottie } from 'lottie-react';
import loaderAnimation from '../assets/liyaqat-loader.json';

const FULL_INTRO_MS = 2500;
const EXIT_MS = 650;

export default function IntroLoader({ onComplete }) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);
  const timers = useRef({ progress: null, exit: null, remove: null });
  const duration = reduceMotion ? 520 : FULL_INTRO_MS;
  const exitDuration = reduceMotion ? 0.12 : EXIT_MS / 1000;

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    window.clearInterval(timers.current.progress);
    window.clearTimeout(timers.current.exit);
    setProgress(100);
    setLeaving(true);
    timers.current.remove = window.setTimeout(onComplete, exitDuration * 1000 + 50);
  }, [onComplete, exitDuration]);

  useEffect(() => {
    const startedAt = Date.now();
    timers.current.progress = window.setInterval(() => {
      const next = Math.min(99, Math.round(((Date.now() - startedAt) / duration) * 100));
      setProgress(next);
    }, 55);
    timers.current.exit = window.setTimeout(finish, duration);

    const handleKey = (event) => {
      if (event.key === 'Escape' || event.key === 'Enter') finish();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.clearInterval(timers.current.progress);
      window.clearTimeout(timers.current.exit);
      window.clearTimeout(timers.current.remove);
      window.removeEventListener('keydown', handleKey);
    };
  }, [duration, finish]);

  return (
    <motion.div
      className="intro-loader"
      role="status"
      aria-label="Opening LIYAQAT portfolio"
      aria-live="polite"
      initial={{ y: '0%' }}
      animate={leaving ? { y: '-101%' } : { y: '0%' }}
      transition={{ duration: exitDuration, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="loader-grid" aria-hidden="true" />
      <div className="loader-topline">
        <span>LIYAQAT<span className="loader-reg">®</span> <i>/</i> DIGITAL WITH FEELING</span>
        <span>INDEPENDENT CREATIVE PRACTICE <b>·</b> 2026</span>
      </div>

      <div className="loader-center">
        <div className="loader-side-note loader-note-left">DESIGN<br />×<br />CODE</div>
        <div className="loader-animation" aria-hidden="true">
          <Lottie
            src={loaderAnimation}
            autoplay={!reduceMotion}
            loop={false}
            className="loader-lottie"
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet', progressiveLoad: true }}
          />
        </div>
        <div className="loader-side-note loader-note-right">IDEAS<br />IN<br />MOTION</div>
        <motion.h1 className="loader-wordmark" initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.22, duration: reduceMotion ? 0.01 : 0.65, ease: [0.22, 1, 0.36, 1] }}>LIYAQAT<span>®</span></motion.h1>
        <motion.p className="loader-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42, duration: reduceMotion ? 0.01 : 0.45 }}>MAKING DIGITAL FEEL <em>A LITTLE DIFFERENT.</em></motion.p>
      </div>

      <div className="loader-bottomline">
        <div className="loader-progress-label"><span>PREPARING YOUR EXPERIENCE</span><span className="loader-percent">{String(progress).padStart(2, '0')}<i>%</i></span></div>
        <div className="loader-progress-track"><motion.span className="loader-progress-fill" style={{ scaleX: progress / 100 }} /></div>
        <div className="loader-foot-meta"><span>NOT JUST ANOTHER PORTFOLIO.</span><button type="button" className="loader-skip" onClick={finish}>SKIP INTRO <span aria-hidden="true">↗</span></button></div>
      </div>
    </motion.div>
  );
}
