import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Check, MoveUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { services } from '../data';

const steps = [
  { n: '01', title: 'Listen & understand', copy: 'We start with your goals, your audience, and what success should feel like.' },
  { n: '02', title: 'Find the direction', copy: 'We shape the idea, visual language, and experience before getting lost in details.' },
  { n: '03', title: 'Make it real', copy: 'Design, motion, and code come together in a thoughtful, working outcome.' },
  { n: '04', title: 'Polish & pass it on', copy: 'We check the details, make the handoff clear, and leave you with something you can use.' },
];

export default function Services() {
  return (
    <main className="inner-page services-page page-gutter">
      <div className="page-kicker"><span>WAYS WE COULD WORK TOGETHER</span><Link to="/contact">Start a conversation <ArrowUpRight size={14} /></Link></div>
      <motion.div className="page-hero-heading services-heading" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}><span className="eyebrow"><span className="eyebrow-dot" /> GOOD IDEAS NEED GOOD CRAFT</span><h1>From first<br />thought to <em>real thing.</em></h1><p>I can step in for a focused piece of work or bring several disciplines together around one bigger idea.</p></motion.div>
      <section className="services-detail-list">{services.map((service, index) => <motion.article className="service-detail-row" key={service.number} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.55, delay: index * 0.06 }}><div className="service-detail-number">{service.number}</div><div className="service-detail-copy"><h2>{service.title}</h2><p>{service.description}</p><span>{service.tags}</span></div><div className="service-detail-points">{(index === 0 ? ['Responsive websites', 'UI systems & prototyping', 'Creative development'] : index === 1 ? ['Visual identity systems', 'Campaign art direction', 'Digital-first design'] : index === 2 ? ['Motion graphics', 'Short-form video edits', 'Interaction details'] : ['Flexible project support', 'Early-stage concepting', 'Creative collaboration']).map((point) => <span key={point}><Check size={14} /> {point}</span>)}</div><Link to="/contact" className="service-detail-arrow" aria-label={`Discuss ${service.title}`}><ArrowUpRight size={20} /></Link></motion.article>)}</section>
      <section className="process-section"><div className="process-heading"><span className="eyebrow"><span className="eyebrow-dot" /> THE PROCESS</span><h2>Thoughtful, not<br /><em>overcomplicated.</em></h2><p>Every project is different. The shared thread is a clear process with room for the unexpected.</p></div><div className="process-steps">{steps.map((step) => <article className="process-step" key={step.n}><span>{step.n}</span><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div></section>
      <section className="services-fit"><div><span className="eyebrow">A GOOD FIT LOOKS LIKE</span><h2>Curiosity, trust,<br /><em>and a little ambition.</em></h2></div><div className="fit-copy"><p>We’ll probably work well together if you’re building something thoughtful, open to collaboration, and excited by the difference good creative work can make.</p><p>Not sure what you need yet? That’s a perfectly good place to start.</p><Link to="/contact" className="text-link">Tell me what’s on your mind <MoveUpRight size={16} /></Link></div></section>
      <section className="services-cta"><span className="eyebrow"><span className="eyebrow-dot" /> NO BIG PITCH NEEDED</span><h2>Start with<br /><em>a hello.</em></h2><Link className="button button-accent" to="/contact">Let’s talk <ArrowDownRight size={17} /></Link><div className="services-cta-shape">✳</div></section>
    </main>
  );
}
