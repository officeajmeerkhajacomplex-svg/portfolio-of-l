import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowDownRight, ArrowUpRight, MoveUpRight, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion';
import { projects, services, siteConfig } from '../data';
import ProjectCard from '../components/ProjectCard';
import ScrollReveal from '../components/ScrollReveal';

function HeroObject() {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), { stiffness: 80, damping: 18 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-16, 16]), { stiffness: 80, damping: 18 });
  const handleMove = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    rawX.set(x - 0.5);
    rawY.set(y - 0.5);
    ref.current.style.setProperty('--pointer-x', `${x * 100}%`);
    ref.current.style.setProperty('--pointer-y', `${y * 100}%`);
  };
  const reset = () => {
    rawX.set(0); rawY.set(0);
    ref.current?.style.setProperty('--pointer-x', '50%');
    ref.current?.style.setProperty('--pointer-y', '50%');
  };
  return (
    <div className="hero-art" ref={ref} onPointerMove={handleMove} onPointerLeave={reset} role="img" aria-label="Interactive abstract 3D-inspired artwork">
      <div className="hero-art-caption"><span>FIG. 001</span><span>FORM FOLLOWS FEELING</span></div>
      <motion.div className="hero-orbital orbital-a" animate={{ rotate: 360 }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="hero-orbital orbital-b" animate={{ rotate: -360 }} transition={{ duration: 48, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="hero-object" style={{ rotateX, rotateY }}>
        <div className="object-core"><span className="object-shine" /><span className="object-cut" /></div>
        <span className="object-ring ring-a" /><span className="object-ring ring-b" />
      </motion.div>
      <motion.div className="hero-floating-square" animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}><span>✳</span></motion.div>
      <motion.div className="hero-floating-chip" animate={{ y: [0, 11, 0], rotate: [0, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}>IDEAS<br />IN MOTION<span>↗</span></motion.div>
      <span className="hero-art-foot">DESIGN × CODE × FEELING</span>
      <span className="hero-cross cross-a">+</span><span className="hero-cross cross-b">+</span>
    </div>
  );
}

function SectionHeading({ number, label, title, extra }) {
  return <ScrollReveal as="div" className="section-heading"><div className="section-marker"><span>{number}</span><span>{label}</span></div><h2>{title}</h2>{extra && <div className="section-heading-extra">{extra}</div>}</ScrollReveal>;
}

const titleLineVariants = {
  hidden: { y: '112%', opacity: 0, filter: 'blur(8px)' },
  visible: { y: '0%', opacity: 1, filter: 'blur(0px)', transition: { duration: 0.86, ease: [0.22, 1, 0.36, 1] } },
};

export default function Home() {
  const heroRef = useRef(null);
  const manifestoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: manifestoProgress } = useScroll({ target: manifestoRef, offset: ['start end', 'end start'] });
  const heroParallax = useSpring(useTransform(heroProgress, [0, 1], [0, 76]), { stiffness: 70, damping: 24 });
  const manifestoHeadingParallax = useTransform(manifestoProgress, [0, 1], [25, -30]);
  const manifestoShapeParallax = useTransform(manifestoProgress, [0, 1], [85, -90]);
  return (
    <main>
      <section ref={heroRef} className="hero-section page-gutter">
        <div className="hero-copy">
          <motion.div className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><span className="eyebrow-dot" /> INDEPENDENT CREATIVE DEVELOPER & DESIGNER</motion.div>
          <motion.h1 aria-label="Digital experiences with feeling." initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.16 } } }}>
            <span className="kinetic-line" aria-hidden="true"><motion.span variants={titleLineVariants}>Digital</motion.span></span>
            <span className="kinetic-line" aria-hidden="true"><motion.span className="hero-title-outline" variants={titleLineVariants}>experiences</motion.span></span>
            <span className="kinetic-line" aria-hidden="true"><motion.span variants={titleLineVariants}>with <em>feeling.</em></motion.span></span>
          </motion.h1>
          <motion.p className="hero-intro" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>I’m LIYAQAT — a multidisciplinary creative shaping brands, building digital experiences, and bringing ideas to life through design, code, and motion.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }}>
            <Link className="button button-primary" to="/work">Explore my work <MoveUpRight size={16} /></Link>
            <Link className="button button-text" to="/about">A bit about me <ArrowDownRight size={17} /></Link>
          </motion.div>
          <motion.div className="hero-bottomline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}><span>{siteConfig.location}</span><span className="hero-scroll-label"><ArrowDown size={14} /> SCROLL TO EXPLORE</span></motion.div>
        </div>
        <motion.div className="hero-art-wrap" style={{ y: reduceMotion ? 0 : heroParallax }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}><HeroObject /></motion.div>
        <div className="hero-side-note">A PERSONAL PRACTICE<br />BUILT ON CURIOSITY.</div>
      </section>

      <div className="ticker-band" aria-label="Services"><div className="ticker-track">{Array.from({ length: 2 }).map((_, i) => <span className="ticker-set" key={i}><b>DESIGN</b><i>✳</i><b>DEVELOPMENT</b><i>✳</i><b>ART DIRECTION</b><i>✳</i><b>MOTION</b><i>✳</i><b>STORYTELLING</b><i>✳</i></span>)}</div></div>

      <section className="work-preview page-gutter section-space">
        <SectionHeading number="01" label="A FEW SELECTED WORLDS" title={<>A little taste of<br /><em>what I do.</em></>} extra={<Link to="/work" className="text-link">View all projects <ArrowUpRight size={16} /></Link>} />
        <div className="project-grid">{projects.slice(0, 3).map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
        <p className="concept-note"><Sparkles size={14} /> These are concept explorations created to show creative direction. Real projects will replace them as the portfolio evolves.</p>
      </section>

      <section ref={manifestoRef} className="manifesto-section page-gutter">
        <ScrollReveal as="div" className="manifesto-label"><span className="eyebrow"><span className="eyebrow-dot" /> THE WAY I SEE IT</span><span className="manifesto-index">A NOTE ON THE WORK / 001</span></ScrollReveal>
        <motion.h2 style={{ y: reduceMotion ? 0 : manifestoHeadingParallax }}>Good work doesn’t just<br />look different. It <em>feels</em><br /><span>like nothing else.</span></motion.h2>
        <ScrollReveal as="div" className="manifesto-bottom" delay={0.08}><p>Strategy gives it direction. Design gives it character. Technology makes it real. The magic lives where they meet.</p><Link to="/about" className="circle-link" aria-label="Read more about LIYAQAT"><ArrowUpRight size={24} /></Link></ScrollReveal>
        <motion.div className="manifesto-scribble" style={{ y: reduceMotion ? 0 : manifestoShapeParallax, rotate: 17 }} aria-hidden="true">✳</motion.div>
      </section>

      <section className="services-preview page-gutter section-space">
        <SectionHeading number="02" label="HOW I CAN HELP" title={<>Different disciplines.<br /><em>One point of view.</em></>} extra={<Link to="/services" className="text-link">Explore services <ArrowUpRight size={16} /></Link>} />
        <div className="service-list">{services.map((service) => <Link className="service-row" to="/services" key={service.number}><span className="service-number">{service.number}</span><div className="service-main"><h3>{service.title}</h3><p>{service.description}</p></div><span className="service-tags">{service.tags}</span><span className="service-arrow"><ArrowUpRight size={20} /></span></Link>)}</div>
      </section>

      <section className="home-cta page-gutter"><div className="home-cta-orbit orbit-left" /><div className="home-cta-orbit orbit-right" /><span className="eyebrow"><span className="eyebrow-dot" /> GOOD THINGS START SOMEWHERE</span><h2>Have a good<br /><em>one in mind?</em></h2><p>Tell me what you’re dreaming up. We’ll figure out how to bring it into the world.</p><Link className="button button-accent" to="/contact">Let’s make it happen <ArrowUpRight size={17} /></Link><span className="home-cta-star">✳</span></section>
    </main>
  );
}
