import { useId } from 'react';

/**
 * Aceternity Liquid Glass-inspired surface with a refractive Chromium filter
 * and a dependable frosted-glass fallback in Safari and Firefox.
 */
export default function LiquidGlass({
  children,
  className = '',
  radius = 999,
  bevelDepth = 14,
  scale = 34,
  aberration = 2,
  frost = 3,
  tint = 0.16,
}) {
  const filterId = `liquid-glass-${useId().replace(/:/g, '')}`;

  return (
    <div
      className={`liquid-glass-surface ${className}`}
      style={{
        borderRadius: radius,
        '--glass-bevel': `${bevelDepth}px`,
        '--glass-tint': tint,
        backdropFilter: `url(#${filterId}) blur(${frost}px) saturate(1.35)`,
        WebkitBackdropFilter: `url(#${filterId}) blur(${frost}px) saturate(1.35)`,
      }}
    >
      <svg className="liquid-glass__defs" aria-hidden="true" focusable="false">
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} xChannelSelector="R" yChannelSelector="G" result="refracted" />
          <feColorMatrix in="refracted" type="saturate" values={1 + aberration / 8} />
        </filter>
      </svg>
      <div className="liquid-glass__content">{children}</div>
      <span className="liquid-glass__rim" aria-hidden="true" />
    </div>
  );
}
