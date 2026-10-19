import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Header, Footer, ScrollToTop, ScrollProgress } from './components/SiteLayout';
import PageTransition from './components/PageTransition';
import IntroLoader from './components/IntroLoader';
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { projects } from './data';

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
  const [showIntro, setShowIntro] = useState(true);
  const finishIntro = useCallback(() => setShowIntro(false), []);
  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <RouteAnnouncer />
      <div className="app-shell" aria-hidden={showIntro} inert={showIntro ? '' : undefined}>
        <ScrollProgress />
        <Header />
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
        <Footer />
      </div>
      {showIntro && <IntroLoader onComplete={finishIntro} />}
    </MotionConfig>
  );
}
