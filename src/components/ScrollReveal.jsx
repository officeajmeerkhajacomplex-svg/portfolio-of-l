import { motion, useReducedMotion } from 'framer-motion';

/** Reusable viewport-triggered reveal; movement is disabled for reduced-motion users. */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 24,
  once = true,
  amount = 0.15,
  as = 'div',
  ...rest
}) {
  const reduce = useReducedMotion();
  const Element = motion[as] || motion.div;
  const offset = reduce ? 0 : distance;
  const start = direction === 'left'
    ? { opacity: 0, x: -offset, y: 0, filter: 'blur(3px)' }
    : direction === 'right'
      ? { opacity: 0, x: offset, y: 0, filter: 'blur(3px)' }
      : { opacity: 0, x: 0, y: offset, filter: 'blur(3px)' };

  return (
    <Element
      className={className}
      initial={reduce ? false : start}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount, margin: '0px 0px -48px 0px' }}
      transition={{ duration: reduce ? 0.01 : 0.72, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Element>
  );
}
