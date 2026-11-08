import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Header, Footer, ScrollToTop, ScrollProgress } from './components/SiteLayout';
import PageTransition from './components/PageTransition';
import { projects } from './data';

const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const IntroLoader = lazy(() => import('./components/IntroLoader'));

const INTRO_SESSION_KEY = 'liyaqat:intro-seen';

function shouldShowIntro() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) !== 'seen';
  } catch {
    return false;
  }
}

function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-label="Loading page">
      <span />
      <span />
      <span />
    </div>
  );
}

function RouteAnnouncer() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const titles = {
      '/': 'LIYAQAT® — Digital, with feeling.',
      '/work': 'Selected Work — LIYAQAT®',
      '/about': 'About — LIYAQAT®',
      '/services': 'Services — LIYAQAT®',
      '/contact': 'Contact — LIYAQAT®',
    };

    if (path.startsWith('/work/')) {
      const slug = path.slice('/work/'.length);
      const project = projects.find((item) => item.slug === slug);
      document.title = project ? `${project.title} — LIYAQAT®` : 'Page not found — LIYAQAT®';
      return;
    }

    document.title = titles[path] || 'Page not found — LIYAQAT®';
  }, [location.pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(shouldShowIntro);

  const finishIntro = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, 'seen');
    } catch {
      // The intro still closes normally when session storage is unavailable.
    }
    setShowIntro(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <RouteAnnouncer />
      <div className="app-shell" aria-hidden={showIntro} inert={showIntro ? '' : undefined}>
        <ScrollProgress />
        <Header />
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Suspense fallback={<RouteLoading />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<ProjectDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>
        <Footer />
      </div>
      {showIntro && (
        <Suspense fallback={null}>
          <IntroLoader onComplete={finishIntro} />
        </Suspense>
      )}
    </MotionConfig>
  );
}
