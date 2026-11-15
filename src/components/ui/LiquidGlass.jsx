import { forwardRef, useId } from 'react';
import { motion } from 'framer-motion';

const LiquidGlass = forwardRef(function LiquidGlass({
  children,
  className = '',
  contentClassName = '',
  radius = 999,
  bevelDepth = 14,
  scale = 48,
  aberration = 4,
  frost = 0.4,
  tint = 0.12,
  style,
  ...props
}, ref) {
  const filterId = 'liquid-glass-' + useId().replace(/:/g, '');

  const glassStyle = {
    borderRadius: radius,
    '--glass-bevel': bevelDepth + 'px',
    '--glass-tint': tint,
    '--glass-aberration': aberration + 'px',
    backdropFilter: 'url(#' + filterId + ') blur(' + frost + 'px) saturate(1.35)',
    WebkitBackdropFilter: 'url(#' + filterId + ') blur(' + frost + 'px) saturate(1.35)',
    ...style,
  };

  return (
    <motion.div
      ref={ref}
      className={'liquid-glass-surface ' + className}
      style={glassStyle}
      {...props}
    >
      <svg className="liquid-glass__defs" aria-hidden="true" focusable="false">
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.018"
            numOctaves="2"
            seed="8"
            result="glass-noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="glass-noise"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />
          <feOffset in="refracted" dx={aberration / 2} dy="0" result="red-fringe-source" />
          <feColorMatrix
            in="red-fringe-source"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red-fringe"
          />
          <feOffset in="refracted" dx={-aberration / 2} dy="0" result="blue-fringe-source" />
          <feColorMatrix
            in="blue-fringe-source"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blue-fringe"
          />
          <feBlend in="refracted" in2="red-fringe" mode="screen" result="red-refracted" />
          <feBlend in="red-refracted" in2="blue-fringe" mode="screen" result="chromatic-glass" />
          <feGaussianBlur in="SourceAlpha" stdDeviation={Math.max(0.5, bevelDepth / 18)} result="rim-blur" />
          <feSpecularLighting
            in="rim-blur"
            surfaceScale={bevelDepth}
            specularConstant="0.62"
            specularExponent="36"
            lightingColor="#ffffff"
            result="rim-light"
          >
            <fePointLight x="-5000" y="-10000" z="22000" />
          </feSpecularLighting>
          <feComposite in="rim-light" in2="SourceAlpha" operator="in" result="curved-rim" />
          <feBlend in="chromatic-glass" in2="curved-rim" mode="screen" />
        </filter>
      </svg>
      <div className={'liquid-glass__content ' + contentClassName}>{children}</div>
      <span className="liquid-glass__rim" aria-hidden="true" />
    </motion.div>
  );
});

export default LiquidGlass;
