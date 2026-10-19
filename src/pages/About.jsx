import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Compass, Download, Eye, Layers3, WandSparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteConfig } from '../data';

const principles = [
  { icon: <Eye size={20} />, title: 'Notice the details.', copy: 'The tiny things add up: the weight of a typeface, the timing of a transition, the way a page breathes.' },
  { icon: <Compass size={20} />, title: 'Start with why.', copy: 'A clear point of view matters more than decoration. Every decision should take the idea somewhere.' },
  { icon: <Layers3 size={20} />, title: 'Think in systems.', copy: 'The best experiences feel coherent from the first interaction to the very last pixel.' },
  { icon: <WandSparkles size={20} />, title: 'Leave room for play.', copy: 'Curiosity makes the work more human. A little unexpected is often what makes it memorable.' },
];

export default function About() {
  return (
    <main className="inner-page about-page page-gutter">
      <div className="page-kicker"><span>THE PERSON BEHIND THE PIXELS</span><Link to="/contact">Say hello <ArrowUpRight size={14} /></Link></div>
      <motion.div className="page-hero-heading about-heading" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}><span className="eyebrow"><span className="eyebrow-dot" /> A LITTLE CONTEXT</span><h1>Curious by<br /><em>default.</em></h1><p>I’m LIYAQAT. A multidisciplinary creative who likes being at the intersection of design, technology, and storytelling.</p><a className="resume-link" href={`${import.meta.env.BASE_URL}resume.pdf`} download="LIYAQAT-Resume.pdf">Download résumé <span>PDF</span><Download size={15} /></a></motion.div>
      <section className="about-portrait-block"><div className="about-visual" aria-label="Abstract monogram artwork"><div className="about-visual-circle circle-one"/><div className="about-visual-circle circle-two"/><div className="about-monogram">L<span>®</span></div><span className="about-visual-note note-one">ALWAYS IN<br />PROGRESS ↗</span><span className="about-visual-note note-two">CURIOUS<br />SINCE DAY ONE.</span><span className="about-visual-star">✳</span></div><div className="about-narrative"><span className="eyebrow">A MULTIDISCIPLINARY MIND</span><h2>One foot in the<br />details. One in the<br /><em>big picture.</em></h2><p>I move between web development, UI/UX, graphic design, video editing, and motion. Not because everything needs to do everything — but because ideas get more interesting when different disciplines talk to each other.</p><p>I care about clear thinking, strong visual choices, and the small moments that make an experience feel considered rather than assembled.</p><p>This portfolio is a living snapshot of that practice. It’s where I explore, test, learn, and make a few things just because the idea won’t leave me alone.</p><Link to="/work" className="text-link">See what I’m exploring <ArrowUpRight size={16} /></Link></div></section>
      <section className="about-principles"><div className="about-principles-head"><span className="eyebrow"><span className="eyebrow-dot" /> MY CREATIVE COMPASS</span><h2>A few things<br /><em>I believe in.</em></h2></div><div className="principle-grid">{principles.map((item, index) => <motion.article className="principle-card" key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }}><span className="principle-icon">{item.icon}</span><span className="principle-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></motion.article>)}</div></section>
      <section className="about-capabilities"><div><span className="eyebrow">THE TOOLBOX IS A WORK IN PROGRESS</span><h2>Many tools.<br /><em>One intention.</em></h2></div><div className="capability-cloud"><span>Creative development</span><span>UI / UX design</span><span>Visual identity</span><span>Motion design</span><span>Video editing</span><span>Creative direction</span><span>Prototyping</span><span>Digital storytelling</span><span>Front-end craft</span></div></section>
      <section className="about-availability"><div className="availability-indicator"><span className="availability-pulse" /> {siteConfig.availability.toUpperCase()}</div><h2>Good people.<br /><em>Good problems.</em></h2><p>I’m interested in thoughtful collaborations with people who care about what they put into the world.</p><Link className="button button-primary" to="/contact">Tell me about it <ArrowDownRight size={16} /></Link></section>
    </main>
  );
}
