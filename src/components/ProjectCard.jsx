import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectArtwork from './ProjectArtwork';
import MagicCard from './ui/MagicCard';

export default function ProjectCard({ project, index = 0 }) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [3, -3]), { stiffness: 180, damping: 24 });
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-3, 3]), { stiffness: 180, damping: 24 });

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientY - rect.top) / rect.height);
    pointerY.set((event.clientX - rect.left) / rect.width);
  };

  const resetPointer = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <motion.article
      className={`project-card project-card-${index + 1}`}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-35px' }}
      transition={{ duration: 0.65, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <MagicCard className="project-magic-card">
        <Link to={`/work/${project.slug}`} className="project-card-link" aria-label={`View ${project.title} concept project`}>
          <div className="project-art-wrap"><ProjectArtwork theme={project.theme} /><span className="project-index">{project.number} / 04</span><span className="project-open"><ArrowUpRight size={20} /></span></div>
          <div className="project-meta"><div><h3>{project.title}</h3><p>{project.category}</p></div><span className="project-year">{project.year}</span></div>
        </Link>
      </MagicCard>
    </motion.article>
  );
}
