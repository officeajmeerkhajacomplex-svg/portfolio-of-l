import { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
};

const itemPresets = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.3 } },
    exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3 } },
  },
  blurInUp: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
    show: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        y: { duration: 0.3 },
        opacity: { duration: 0.4 },
        filter: { duration: 0.3 },
      },
    },
    exit: {
      opacity: 0,
      filter: 'blur(10px)',
      y: 20,
      transition: {
        y: { duration: 0.3 },
        opacity: { duration: 0.4 },
        filter: { duration: 0.3 },
      },
    },
  },
  blurInDown: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: -20 },
    show: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        y: { duration: 0.3 },
        opacity: { duration: 0.4 },
        filter: { duration: 0.3 },
      },
    },
    exit: { opacity: 0, filter: 'blur(10px)', y: -20 },
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
  },
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 20, opacity: 0, transition: { duration: 0.3 } },
  },
  slideLeft: {
    hidden: { x: 20, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3 } },
  },
  slideRight: {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: 20, opacity: 0, transition: { duration: 0.3 } },
  },
  scaleUp: {
    hidden: { scale: 0.5, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, scale: { type: 'spring', damping: 15, stiffness: 300 } },
    },
    exit: { scale: 0.5, opacity: 0, transition: { duration: 0.3 } },
  },
  scaleDown: {
    hidden: { scale: 1.5, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, scale: { type: 'spring', damping: 15, stiffness: 300 } },
    },
    exit: { scale: 1.5, opacity: 0, transition: { duration: 0.3 } },
  },
};

function splitSegments(children, by) {
  if (by === 'character') return Array.from(children);
  if (by === 'line') return children.split('\n');
  if (by === 'word') return children.split(/(\s+)/);
  return [children];
}

/**
 * Magic UI-compatible text entrance animation, adapted to the Framer Motion
 * dependency already used by this project.
 */
function TextAnimateBase({
  children,
  delay = 0,
  duration = 0.3,
  variants,
  className = '',
  segmentClassName = '',
  as = 'p',
  startOnView = true,
  once = false,
  by = 'word',
  animation = 'fadeIn',
  accessible = true,
}) {
  const shouldReduceMotion = useReducedMotion();
  const segments = useMemo(
    () => splitSegments(String(children ?? ''), by),
    [children, by],
  );
  const Component = motionElements[as] || motion.span;
  const itemVariants = variants || itemPresets[animation] || itemPresets.fadeIn;
  const stagger = segments.length > 0 ? duration / segments.length : 0;
  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { delayChildren: delay, staggerChildren: stagger },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: stagger, staggerDirection: -1 },
    },
  };

  return (
    <Component
      variants={containerVariants}
      initial={shouldReduceMotion ? 'show' : 'hidden'}
      whileInView={!shouldReduceMotion && startOnView ? 'show' : undefined}
      animate={shouldReduceMotion || !startOnView ? 'show' : undefined}
      exit="exit"
      className={'text-animate__container ' + className}
      viewport={{ once }}
      aria-label={accessible ? String(children ?? '') : undefined}
    >
      {accessible && <span className="sr-only">{children}</span>}
      {segments.map((segment, index) => (
        <motion.span
          key={by + '-' + index + '-' + segment}
          variants={itemVariants}
          className={'text-animate__segment ' + segmentClassName}
          aria-hidden={accessible ? true : undefined}
        >
          {segment}
        </motion.span>
      ))}
    </Component>
  );
}

export const TextAnimate = memo(TextAnimateBase);
export default TextAnimate;
