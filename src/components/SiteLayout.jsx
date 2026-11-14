import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { siteConfig } from '../data';

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
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="site-header redesign-header">
      <div className="header-inner page-gutter">
        <Link to="/" className="wordmark redesign-wordmark" aria-label="LIYAQAT home">
          LIYAQAT<span className="registered">®</span><span className="wordmark-dot" />
        </Link>
        <nav className="desktop-nav redesign-desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link redesign-nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/contact" className="header-cta redesign-header-cta">
          <span>Let’s talk</span><ArrowUpRight size={15} strokeWidth={1.8} />
        </Link>
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
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav redesign-mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
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
                  className={({ isActive }) => `mobile-nav-link redesign-mobile-nav-link${isActive ? ' active' : ''}`}
                >
                  {item.label}<ArrowDownRight size={18} />
                </NavLink>
              </motion.div>
            ))}
            <Link to="/contact" className="mobile-nav-contact redesign-mobile-nav-contact">
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
          <Link className="redesign-footer__contact-link" to="/contact">
            Start a conversation <ArrowUpRight size={18} />
          </Link>
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
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a href={`${import.meta.env.BASE_URL}resume.pdf`} download="LIYAQAT-Resume.pdf">Download résumé <Download size={13} /></a>
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
