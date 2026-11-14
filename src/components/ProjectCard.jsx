import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import ProjectArtwork from './ProjectArtwork';
import MagicCard from './ui/MagicCard';

export default function ProjectCard({ project, index = 0 }) {
  const cardRef = useRef(null);
  const artworkRef = useRef(null);
  const quickRotateX = useRef(null);
  const quickRotateY = useRef(null);
  const quickArtworkX = useRef(null);
  const quickArtworkY = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const artwork = artworkRef.current;
    if (!card || !artwork || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    gsap.set(card, { transformPerspective: 1200 });
    quickRotateX.current = gsap.quickTo(card, 'rotationX', { duration: 0.48, ease: 'power3.out' });
    quickRotateY.current = gsap.quickTo(card, 'rotationY', { duration: 0.48, ease: 'power3.out' });
    quickArtworkX.current = gsap.quickTo(artwork, 'x', { duration: 0.55, ease: 'power3.out' });
    quickArtworkY.current = gsap.quickTo(artwork, 'y', { duration: 0.55, ease: 'power3.out' });

    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      quickRotateX.current?.(y * -6);
      quickRotateY.current?.(x * 6);
      quickArtworkX.current?.(x * -9);
      quickArtworkY.current?.(y * -9);
    };

    const reset = () => {
      quickRotateX.current?.(0);
      quickRotateY.current?.(0);
      quickArtworkX.current?.(0);
      quickArtworkY.current?.(0);
    };

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', reset);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', reset);
      gsap.killTweensOf([card, artwork]);
    };
  }, []);

  return (
    <article ref={cardRef} className={`project-card project-card-${index + 1}`}>
      <MagicCard className="project-magic-card">
        <Link
          to={`/work/${project.slug}`}
          className="project-card-link"
          aria-label={`View ${project.title} concept project`}
          data-cursor="VIEW"
          data-cursor-project=""
        >
          <div className="project-art-wrap" ref={artworkRef}>
            <ProjectArtwork theme={project.theme} />
            <span className="project-index">{project.number} / 04</span>
            <span className="project-open"><ArrowUpRight size={20} /></span>
            <span className="project-art-invitation">EXPLORE THE STORY <ArrowUpRight size={13} /></span>
          </div>
          <div className="project-meta">
            <div className="project-meta__copy">
              <p className="project-category">{project.category}</p>
              <h3>{project.title}</h3>
              <p className="project-card__tagline">{project.tagline}</p>
              <p className="project-card__summary">{project.description}</p>
            </div>
            <span className="project-year">{project.year}</span>
          </div>
          <div className="project-card__footer">
            <div className="project-card__tags" aria-label="Project disciplines">
              {project.disciplines.map((discipline) => (
                <span className="project-card__tag" key={discipline}>{discipline}</span>
              ))}
            </div>
            <span className="project-card__action">OPEN CASE STUDY <ArrowUpRight size={13} /></span>
          </div>
        </Link>
      </MagicCard>
    </article>
  );
}
