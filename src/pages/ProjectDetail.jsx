import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, MoveUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { projects, siteConfig } from '../data';
import ProjectArtwork from '../components/ProjectArtwork';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <Navigate to="/work" replace />;
  const currentIndex = projects.findIndex((item) => item.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  return (
    <main className="inner-page project-detail page-gutter">
      <div className="page-kicker"><Link to="/work"><ArrowLeft size={14} /> Back to selected work</Link><span>CASE STUDY / {project.number}</span></div>
      <motion.div className="project-detail-heading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><span className="eyebrow"><span className="eyebrow-dot" /> {project.category.toUpperCase()}</span><h1>{project.title}<span className="project-title-period">.</span></h1><p>{project.tagline}</p></motion.div>
      <motion.div className="detail-artwork" initial={{ opacity: 0, scale: 0.975 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75 }}><ProjectArtwork theme={project.theme} /></motion.div>
      <div className="detail-top-meta"><div><span>DISCIPLINES</span><p>{project.disciplines.join(' · ')}</p></div><div><span>YEAR</span><p>{project.year}</p></div><div><span>PROJECT TYPE</span><p>Self-initiated concept</p></div></div>
      <div className="detail-story-grid"><div className="detail-story-lead"><span className="eyebrow">THE BIG IDEA</span><h2>Good design starts with a <em>good question.</em></h2></div><div className="detail-story-copy"><p className="detail-description">{project.description}</p><div className="detail-story-block"><span>01 / THE CHALLENGE</span><p>{project.challenge}</p></div><div className="detail-story-block"><span>02 / THE APPROACH</span><p>{project.approach}</p></div><div className="detail-story-block"><span>03 / THE INTENTION</span><p>{project.outcome}</p></div></div></div>
      <div className="detail-services"><span className="eyebrow">WHAT WENT INTO IT</span><div>{project.services.map((service) => <span className="detail-service-chip" key={service}>{service}</span>)}</div></div>
      <div className="detail-next-project"><div><span className="eyebrow">KEEP EXPLORING</span><h2>Up next: <em>{nextProject.title}</em></h2></div><Link className="circle-link" to={`/work/${nextProject.slug}`} aria-label={`View ${nextProject.title}`}><ArrowUpRight size={23} /></Link></div>
      <section className="detail-contact-strip"><p>Have a brief with a little more possibility?</p><Link to="/contact">Let’s talk <MoveUpRight size={16} /></Link><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></section>
    </main>
  );
}
