import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectArtwork from './ProjectArtwork';

export default function ProjectCard({ project, index = 0 }) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [4, -4]), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-4, 4]), { stiffness: 180, damping: 22 });

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };
  const resetPointer = () => { pointerX.set(0.5); pointerY.set(0.5); };

  return (
    <motion.article
      className={`project-card project-card-${index + 1}`}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-35px' }}
      transition={{ duration: 0.65, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/work/${project.slug}`} className="project-card-link" aria-label={`View ${project.title} concept project`}>
        <div className="project-art-wrap"><ProjectArtwork theme={project.theme} /><span className="project-index">{project.number} / 04</span><span className="project-open"><ArrowUpRight size={20} /></span></div>
        <div className="project-meta"><div><h3>{project.title}</h3><p>{project.category}</p></div><span className="project-year">{project.year}</span></div>
      </Link>
    </motion.article>
  );
}
