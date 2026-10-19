import { motion, useReducedMotion } from 'framer-motion';

export default function PageTransition({ children }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="page-transition"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(5px)', clipPath: 'inset(0 0 7% 0)' }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0% 0)' }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -9, filter: 'blur(4px)', clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: reduceMotion ? 0.12 : 0.48, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
