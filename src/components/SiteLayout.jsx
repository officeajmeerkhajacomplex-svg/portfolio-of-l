import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { gsap } from '../lib/gsap';
import { siteConfig } from '../data';
import GsapMagnetic from './ui/GsapMagnetic';
import LiquidGlass from './ui/LiquidGlass';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return <motion.div className="top-progress" style={{ scaleX, transformOrigin: '0% 50%' }} aria-hidden="true" />;
}

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const glassRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const updateScrollState = () => {
      const next = window.scrollY > 42;
      setIsScrolled((current) => current === next ? current : next);
    };
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    const glass = glassRef.current;
    const content = contentRef.current;
    if (!glass || !content) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = {
      borderRadius: isScrolled ? 999 : 28,
      boxShadow: isScrolled
        ? '0 12px 38px rgba(32,34,30,.12), 0 1px 0 rgba(255,255,255,.82) inset'
        : '0 8px 28px rgba(32,34,30,.075), 0 1px 0 rgba(255,255,255,.9) inset',
    };

    if (reduced) {
      gsap.set(glass, targets);
      gsap.set(content, { minHeight: isScrolled ? 62 : 78 });
      return undefined;
    }

    gsap.to(glass, { ...targets, duration: 0.48, ease: 'power3.out', overwrite: true });
    gsap.to(content, {
      minHeight: isScrolled ? 62 : 78,
      paddingLeft: isScrolled ? 20 : 26,
      paddingRight: isScrolled ? 20 : 26,
      duration: 0.48,
      ease: 'power3.out',
      overwrite: true,
    });
    return () => gsap.killTweensOf([glass, content]);
  }, [isScrolled]);

  return (
    <header className={'site-header redesign-header' + (isScrolled ? ' is-scrolled' : '')}>
      <div className="header-inner page-gutter">
        <LiquidGlass
          ref={glassRef}
          className={'redesign-header-glass' + (isScrolled ? ' is-scrolled' : '')}
          radius={isScrolled ? 999 : 28}
          scale={48}
          aberration={14}
          bevelDepth={37}
          frost={0.4}
          tint={0.12}
        >
          <div className="redesign-header-content" ref={contentRef}>
            <Link to="/" className="wordmark redesign-wordmark" aria-label="LIYAQAT home">
              LIYAQAT<span className="registered">®</span><span className="wordmark-dot" />
            </Link>
            <div className="redesign-header-actions">
              <nav className="desktop-nav redesign-desktop-nav" aria-label="Main navigation">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => 'nav-link redesign-nav-link' + (isActive ? ' active' : '')}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <GsapMagnetic className="gsap-magnetic-wrap redesign-header-magnetic" strength={0.1}>
                <Link to="/contact" className="header-cta redesign-header-cta" data-cursor="SAY HELLO">
                  <span>Let’s talk</span><ArrowUpRight size={15} strokeWidth={1.8} />
                </Link>
              </GsapMagnetic>
            </div>
            <button
              className="menu-toggle redesign-menu-toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </LiquidGlass>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav redesign-mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.045 }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => 'mobile-nav-link redesign-mobile-nav-link' + (isActive ? ' active' : '')}
                >
                  {item.label}<ArrowDownRight size={18} />
                </NavLink>
              </motion.div>
            ))}
            <Link to="/contact" className="mobile-nav-contact redesign-mobile-nav-contact" data-cursor="START">
              Start a project <ArrowUpRight size={18} />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer redesign-footer">
      <div className="redesign-footer__main page-gutter">
        <div className="redesign-footer__invite">
          <span className="editorial-kicker"><span className="availability-pulse" /> HAVE SOMETHING GOOD IN MIND?</span>
          <h2>Let’s make<br /><em>it matter.</em></h2>
          <GsapMagnetic className="gsap-magnetic-wrap" strength={0.12}>
            <Link className="redesign-footer__contact-link" to="/contact">
              Start a conversation <ArrowUpRight size={18} />
            </Link>
          </GsapMagnetic>
        </div>
        <div className="redesign-footer__links">
          <div>
            <span className="redesign-footer__label">EXPLORE</span>
            <Link to="/work">Selected work</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
          </div>
          <div>
            <span className="redesign-footer__label">SAY HELLO</span>
            <a href={'mailto:' + siteConfig.email}>{siteConfig.email}</a>
            <a href={import.meta.env.BASE_URL + 'resume.pdf'} download="LIYAQAT-Resume.pdf">Download résumé <Download size={13} /></a>
            <span className="redesign-footer__availability"><i /> {siteConfig.availability}</span>
          </div>
        </div>
      </div>
      <div className="redesign-footer__bottom page-gutter">
        <Link to="/" className="footer-wordmark">LIYAQAT<span>®</span></Link>
        <span>Independent by nature. Collaborative by design.</span>
        <span>© {year} · Made with intention.</span>
      </div>
    </footer>
  );
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
