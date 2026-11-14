import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowDownRight, ArrowUpRight, MoveUpRight, Sparkles } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from 'framer-motion';
import { projects, services, siteConfig } from '../data';
import ProjectCard from '../components/ProjectCard';
import ScrollReveal from '../components/ScrollReveal';
import LottieMark from '../components/LottieMark';
import orbitMark from '../assets/orbit-mark.json';

function HeroObject() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [9, -9]), { stiffness: 70, damping: 20 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), { stiffness: 70, damping: 20 });

  const handleMove = (event) => {
    if (reduceMotion || event.pointerType === 'touch') return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((event.clientX - rect.left) / rect.width - 0.5);
    rawY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      className="hero-art redesign-hero-art"
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      role="img"
      aria-label="An abstract sculptural coral form with delicate orbit lines"
    >
      <div className="hero-art-caption"><span>OBJECT STUDY / 001</span><span>FORM FOLLOWS FEELING</span></div>
      <motion.div
        className="hero-orbital orbital-a"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="hero-orbital orbital-b"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 84, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div className="hero-object" style={reduceMotion ? undefined : { rotateX, rotateY }}>
        <div className="object-core"><span className="object-shine" /><span className="object-cut" /></div>
        <span className="object-ring ring-a" />
        <span className="object-ring ring-b" />
      </motion.div>
      <motion.div
        className="hero-floating-square"
        animate={reduceMotion ? undefined : { y: [0, -6, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      ><span>✳</span></motion.div>
      <motion.div
        className="hero-floating-chip"
        animate={reduceMotion ? undefined : { y: [0, 6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >IDEAS IN MOTION<span>↗</span></motion.div>
      <span className="hero-art-foot">DESIGN × CODE × FEELING</span>
      <span className="hero-cross cross-a">+</span>
      <span className="hero-cross cross-b">+</span>
      <span className="hero-art-index">L / 26</span>
    </div>
  );
}

function SectionHeading({ index, label, title, link }) {
  return (
    <div className="redesign-section-heading">
      <div className="redesign-section-heading__meta">
        <span>{index}</span>
        <span>{label}</span>
      </div>
      <div className="redesign-section-heading__main">
        <h2>{title}</h2>
        {link}
      </div>
    </div>
  );
}

const lineVariants = {
  hidden: { y: '112%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Home() {
  const heroRef = useRef(null);
  const manifestoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const { scrollYProgress: manifestoProgress } = useScroll({
    target: manifestoRef,
    offset: ['start end', 'end start'],
  });
  const heroParallax = useSpring(useTransform(heroProgress, [0, 1], [0, 42]), {
    stiffness: 55,
    damping: 24,
  });
  const manifestoY = useTransform(manifestoProgress, [0, 1], [18, -18]);

  return (
    <main className="redesign-home">
      <section ref={heroRef} className="editorial-hero page-gutter">
        <div className="editorial-hero__copy">
          <motion.div
            className="editorial-kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="availability-pulse" />
            INDEPENDENT CREATIVE PRACTICE
            <LottieMark src={orbitMark} className="hero-lottie-mark" />
          </motion.div>

          <motion.h1
            aria-label="Digital work with feeling."
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
            }}
          >
            <span className="editorial-title-line"><motion.span variants={lineVariants}>Digital</motion.span></span>
            <span className="editorial-title-line"><motion.span variants={lineVariants}>work with</motion.span></span>
            <span className="editorial-title-line editorial-title-accent"><motion.span variants={lineVariants}>feeling<span className="title-period">.</span></motion.span></span>
          </motion.h1>

          <motion.p
            className="editorial-hero__intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
          >
            I’m LIYAQAT — a multidisciplinary designer and creative developer shaping thoughtful identities, digital experiences and moving images.
          </motion.p>

          <motion.div
            className="editorial-hero__actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.48 }}
          >
            <Link className="editorial-button editorial-button--dark" to="/work">
              Explore selected work <MoveUpRight size={16} />
            </Link>
            <Link className="editorial-text-link" to="/contact">
              Start a conversation <ArrowUpRight size={15} />
            </Link>
          </motion.div>

          <div className="editorial-hero__foot">
            <span>{siteConfig.location}</span>
            <a href="#selected-work"><ArrowDown size={14} /> SCROLL TO EXPLORE</a>
          </div>
        </div>

        <motion.div
          className="editorial-hero__visual"
          style={{ y: reduceMotion ? 0 : heroParallax }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroObject />
          <div className="editorial-hero__visual-note">
            <span>AN OPEN MIND.</span>
            <span>A SHARP EYE.</span>
            <span>GOOD ENERGY.</span>
          </div>
        </motion.div>

        <span className="editorial-hero__side-label">DESIGN / DIGITAL / MOTION</span>
      </section>

      <div className="editorial-marquee" aria-label="Creative disciplines">
        <div className="editorial-marquee__track">
          {Array.from({ length: 2 }).map((_, index) => (
            <span className="editorial-marquee__set" key={index}>
              <b>IDENTITY</b><i>✳</i><b>DIGITAL</b><i>✳</i><b>ART DIRECTION</b><i>✳</i><b>MOTION</b><i>✳</i><b>DEVELOPMENT</b><i>✳</i>
            </span>
          ))}
        </div>
      </div>

      <section className="redesign-section redesign-work-preview page-gutter" id="selected-work">
        <SectionHeading
          index="01"
          label="A FEW SELECTED WORLDS"
          title={<>Made to make<br /><em>you feel something.</em></>}
          link={<Link className="editorial-text-link" to="/work">View all work <ArrowUpRight size={15} /></Link>}
        />
        <div className="project-grid redesign-project-grid">
          {projects.slice(0, 3).map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
        <div className="redesign-work-note">
          <Sparkles size={15} />
          <p>These are self-initiated concept explorations — a glimpse of the ideas, systems and details I love bringing to life.</p>
        </div>
      </section>

      <section ref={manifestoRef} className="editorial-manifesto page-gutter">
        <div className="editorial-manifesto__top">
          <span className="editorial-kicker"><span className="availability-pulse" /> A POINT OF VIEW</span>
          <span>THOUGHT / 001 — 2026</span>
        </div>
        <motion.h2 style={{ y: reduceMotion ? 0 : manifestoY }}>
          Good work should<br />
          do more than <em>look good.</em><br />
          It should <span>stay with you.</span>
        </motion.h2>
        <div className="editorial-manifesto__bottom">
          <span>STRATEGY GIVES IT DIRECTION. DESIGN GIVES IT CHARACTER.</span>
          <Link to="/about">A little more about me <ArrowUpRight size={15} /></Link>
        </div>
        <span className="editorial-manifesto__mark" aria-hidden="true">✳</span>
      </section>

      <section className="redesign-section redesign-services-preview page-gutter">
        <SectionHeading
          index="02"
          label="WHAT I BRING TO THE TABLE"
          title={<>Different skills.<br /><em>One clear point of view.</em></>}
          link={<Link className="editorial-text-link" to="/services">Explore services <ArrowUpRight size={15} /></Link>}
        />
        <div className="editorial-service-list">
          {services.map((service) => (
            <Link className="editorial-service-row" to="/services" key={service.number}>
              <span className="editorial-service-row__number">{service.number}</span>
              <span className="editorial-service-row__title">{service.title}</span>
              <span className="editorial-service-row__description">{service.description}</span>
              <span className="editorial-service-row__arrow"><ArrowUpRight size={19} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="editorial-contact-cta page-gutter">
        <div className="editorial-contact-cta__meta">
          <span className="editorial-kicker"><span className="availability-pulse" /> {siteConfig.availability.toUpperCase()}</span>
          <span>HAVE SOMETHING GOOD IN MIND?</span>
        </div>
        <div className="editorial-contact-cta__body">
          <h2>Let’s make<br /><em>it matter.</em></h2>
          <div className="editorial-contact-cta__aside">
            <p>Big brief, small question or a half-formed idea. The best things usually start with a conversation.</p>
            <Link className="editorial-button editorial-button--coral" to="/contact">Tell me about it <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
