import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

const REVEAL_SELECTORS = [
  '.redesign-section-heading',
  '.editorial-manifesto__top',
  '.editorial-manifesto__bottom',
  '.editorial-service-row',
  '.editorial-contact-cta__meta',
  '.editorial-contact-cta__body',
  '.redesign-work-note',
  '.page-kicker',
  '.page-hero-heading .eyebrow',
  '.page-hero-heading > p',
  '.contact-intro .eyebrow',
  '.contact-intro > p',
  '.contact-layout > *',
  '.about-portrait-block > *',
  '.about-principles-head',
  '.principle-card',
  '.about-capabilities > *',
  '.about-availability',
  '.service-detail-row',
  '.process-heading',
  '.process-step',
  '.services-fit > *',
  '.services-cta',
  '.detail-top-meta',
  '.detail-story-grid > *',
  '.detail-next-project',
  '.contact-bottom-line',
  '.work-filter-row',
  '.work-filter-controls',
  '.work-disclaimer',
  '.work-bottom-cta',
  '.project-card',
];

export default function useEditorialMotion() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return undefined;

    let media;
    const context = gsap.context(() => {
      media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const hero = element.querySelector('.editorial-hero');
        if (hero) {
          const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
          intro
            .fromTo(hero.querySelector('.editorial-kicker'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55 })
            .fromTo(hero.querySelectorAll('.editorial-title-line > span'), { yPercent: 115, rotate: 1.5 }, { yPercent: 0, rotate: 0, duration: 1.05, stagger: 0.13 }, '-=0.18')
            .fromTo(hero.querySelector('.editorial-hero__intro'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.48')
            .fromTo(hero.querySelector('.editorial-hero__actions'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.4')
            .fromTo(hero.querySelector('.editorial-hero__visual'), { autoAlpha: 0, scale: 0.94, rotate: 1.5 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.1 }, '-=0.8')
            .fromTo(hero.querySelector('.editorial-hero__foot'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '-=0.5');

          gsap.to(hero.querySelectorAll('.hero-orbital'), {
            rotation: (index) => index ? -360 : 360,
            duration: (index) => index ? 86 : 68,
            repeat: -1,
            ease: 'none',
          });
          gsap.to(hero.querySelector('.hero-floating-square'), {
            y: -9, rotation: 5, duration: 4.8, repeat: -1, yoyo: true, ease: 'sine.inOut',
          });
          gsap.to(hero.querySelector('.hero-floating-chip'), {
            y: 8, rotation: -2, duration: 5.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.35,
          });
        } else {
          const pageHeading = element.querySelector('.page-hero-heading, .contact-intro, .project-detail-heading');
          if (pageHeading) {
            gsap.timeline()
              .fromTo(pageHeading.querySelector('.eyebrow'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 })
              .fromTo(pageHeading.querySelector('h1'), { autoAlpha: 0, y: 34, clipPath: 'inset(0 0 18% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.95 }, '-=0.22')
              .fromTo(pageHeading.querySelector('p'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.42');
          }
        }

        REVEAL_SELECTORS.forEach((selector) => {
          const nodes = element.querySelectorAll(selector);
          nodes.forEach((node, index) => {
            if (node.closest('.editorial-hero')) return;
            gsap.fromTo(node,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.78,
                delay: Math.min(index * 0.045, 0.22),
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: node,
                  start: 'top 89%',
                  once: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          });
        });

        const art = element.querySelector('.redesign-hero-art');
        if (art) {
          gsap.to(art, {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: art,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.7,
            },
          });
        }

        const manifestoMark = element.querySelector('.editorial-manifesto__mark');
        if (manifestoMark) {
          gsap.to(manifestoMark, { rotation: 376, duration: 72, repeat: -1, ease: 'none' });
        }

        const marquee = element.querySelector('.editorial-marquee__track');
        if (marquee) {
          gsap.to(marquee, {
            xPercent: -50,
            duration: 34,
            repeat: -1,
            ease: 'none',
          });
        }

        ScrollTrigger.refresh();
      });
    }, element);

    return () => {
      media?.revert();
      context.revert();
    };
  }, []);

  return root;
}
