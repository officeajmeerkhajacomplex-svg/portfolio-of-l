import { motion } from 'framer-motion';

export default function ProjectArtwork({ theme, compact = false }) {
  return (
    <div className={`project-art art-${theme}${compact ? ' compact' : ''}`} aria-hidden="true">
      {theme === 'forma' && <>
        <div className="forma-sun" />
        <div className="forma-floor" />
        <div className="forma-chair"><i /><b /><span /></div>
        <div className="forma-plant"><i /><i /><i /><i /><b /></div>
        <span className="art-micro forma-micro">A SLOWER KIND OF LIVING</span>
        <span className="art-title forma-title">Make room<br /><em>for living.</em></span>
        <span className="forma-circle">F.</span>
      </>}
      {theme === 'afterhours' && <>
        <div className="after-grid" />
        <div className="after-disc"><span>AH</span></div>
        <div className="after-orbit orbit-one" /><div className="after-orbit orbit-two" />
        <span className="art-micro after-micro">INDEPENDENT CULTURE / VOL. 001</span>
        <span className="art-title after-title">AFTER<br /><i>HOURS</i></span>
        <span className="after-tag">STAY A LITTLE LONGER ↗</span>
      </>}
      {theme === 'goodthings' && <>
        <div className="good-sun" />
        <div className="good-flower flower-one"><i /><i /><i /><i /><i /><i /><b /></div>
        <div className="good-flower flower-two"><i /><i /><i /><i /><i /><i /><b /></div>
        <span className="art-micro good-micro">A GOOD THING, EVERY DAY</span>
        <span className="art-title good-title">GOOD<br /><em>THINGS</em><br />CLUB<span>✳</span></span>
        <span className="good-bottom">JOIN THE NICE SIDE.</span>
      </>}
      {theme === 'signal' && <>
        <div className="signal-grid" />
        <div className="signal-sun" />
        <span className="art-title signal-title">MAKE<br />SOME<br /><em>NOISE.</em></span>
        <div className="signal-bars"><i /><i /><i /><i /><i /></div>
        <span className="signal-label">SIGNAL STUDIO®<br />CREATIVE PRACTICE / 001</span>
        <span className="signal-cross">+</span>
      </>}
      <motion.div className="art-grain" animate={{ opacity: [0.16, 0.24, 0.16] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
  );
}
