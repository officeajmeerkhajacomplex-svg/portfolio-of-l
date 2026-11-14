import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import ProjectArtwork from './ProjectArtwork';
import MagicCard from './ui/MagicCard';

export default function ProjectCard({ project, index = 0 }) {
  const cardRef = useRef(null);
  const quickRotateX = useRef(null);
  const quickRotateY = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return undefined;

    quickRotateX.current = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power3.out' });
    quickRotateY.current = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power3.out' });
    const onMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      quickRotateX.current?.(y * -4);
      quickRotateY.current?.(x * 4);
    };
    const reset = () => {
      quickRotateX.current?.(0);
      quickRotateY.current?.(0);
    };

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', reset);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', reset);
      gsap.killTweensOf(card);
    };
  }, []);

  return (
    <article ref={cardRef} className={`project-card project-card-${index + 1}`}>
      <MagicCard className="project-magic-card">
        <Link to={`/work/${project.slug}`} className="project-card-link" aria-label={`View ${project.title} concept project`}>
          <div className="project-art-wrap">
            <ProjectArtwork theme={project.theme} />
            <span className="project-index">{project.number} / 04</span>
            <span className="project-open"><ArrowUpRight size={20} /></span>
          </div>
          <div className="project-meta">
            <div><h3>{project.title}</h3><p>{project.category}</p></div>
            <span className="project-year">{project.year}</span>
          </div>
        </Link>
      </MagicCard>
    </article>
  );
}
