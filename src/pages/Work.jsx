import { ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data';
import ProjectCard from '../components/ProjectCard';

export default function Work() {
  return (
    <main className="inner-page work-page page-gutter">
      <div className="page-kicker"><span>SELECTED WORK / 2024—2026</span><Link to="/contact">Have a project? <ArrowUpRight size={14} /></Link></div>
      <motion.div className="page-hero-heading" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}><span className="eyebrow"><span className="eyebrow-dot" /> A FEW THINGS I’VE BEEN EXPLORING</span><h1>Work that<br /><em>makes a feeling.</em></h1><p>Digital experiences, visual identities, and moving images — connected by curiosity and an eye for the details.</p></motion.div>
      <div className="work-filter-row"><span><span className="tiny-live-dot" /> {String(projects.length).padStart(2, '0')} SELECTED CONCEPTS</span><span>DESIGN · DIGITAL · MOTION</span></div>
      <div className="project-grid work-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      <div className="work-disclaimer"><Sparkles size={16} /><p><strong>A quick note:</strong> The projects shown here are concept explorations, not commissioned client work. They’re a starting point for showing my approach to visual thinking, interaction, and craft.</p></div>
      <section className="work-bottom-cta"><div><span className="eyebrow">YOUR IDEA COULD BE NEXT</span><h2>Let’s make a<br /><em>new favourite.</em></h2></div><Link className="circle-link" to="/contact" aria-label="Start a project"><ArrowDownRight size={24} /></Link></section>
    </main>
  );
}
