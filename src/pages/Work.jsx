import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data';
import ProjectCard from '../components/ProjectCard';

const filters = ['All work', 'Digital', 'Identity', 'Motion'];

function matchesFilter(project, filter) {
  if (filter === 'All work') return true;
  const disciplines = project.disciplines.join(' ').toLowerCase();
  if (filter === 'Digital') return /ui\/ux|development|web|experience/.test(disciplines);
  if (filter === 'Identity') return /identity|art direction|strategy|design/.test(disciplines);
  if (filter === 'Motion') return /motion|creative coding|editing|animation/.test(disciplines);
  return true;
}

export default function Work() {
  const [activeFilter, setActiveFilter] = useState('All work');
  const visibleProjects = useMemo(
    () => projects.filter((project) => matchesFilter(project, activeFilter)),
    [activeFilter]
  );

  return (
    <main className="inner-page work-page redesign-page redesign-work-page page-gutter">
      <div className="page-kicker"><span>SELECTED WORK / 2024—2026</span><Link to="/contact">Have a project? <ArrowUpRight size={14} /></Link></div>
      <motion.div className="page-hero-heading" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
        <span className="eyebrow"><span className="eyebrow-dot" /> A FEW THINGS I’VE BEEN EXPLORING</span>
        <h1>Work that<br /><em>makes a feeling.</em></h1>
        <p>Digital experiences, visual identities, and moving images — connected by curiosity and an eye for the details.</p>
      </motion.div>
      <div className="work-filter-row">
        <span><span className="tiny-live-dot" /> {String(visibleProjects.length).padStart(2, '0')} SELECTED CONCEPTS</span>
        <span>DESIGN · DIGITAL · MOTION</span>
      </div>
      <div className="work-filter-controls flex flex-wrap items-center gap-2.5" role="group" aria-label="Filter projects">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`work-filter-chip${activeFilter === filter ? ' active' : ''}`}
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
            {filter === activeFilter && <span className="filter-count">{String(visibleProjects.length).padStart(2, '0')}</span>}
          </button>
        ))}
      </div>
      <motion.div key={activeFilter} className="project-grid work-grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}>
        {visibleProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
      </motion.div>
      {visibleProjects.length === 0 && <p className="work-empty">No projects in this category yet. Check back soon.</p>}
      <div className="work-disclaimer ui-raised"><Sparkles size={16} /><p><strong>A quick note:</strong> The projects shown here are concept explorations, not commissioned client work. They’re a starting point for showing my approach to visual thinking, interaction, and craft.</p></div>
      <section className="work-bottom-cta"><div><span className="eyebrow">YOUR IDEA COULD BE NEXT</span><h2>Let’s make a<br /><em>new favourite.</em></h2></div><Link className="circle-link" to="/contact" aria-label="Start a project"><ArrowDownRight size={24} /></Link></section>
    </main>
  );
}
