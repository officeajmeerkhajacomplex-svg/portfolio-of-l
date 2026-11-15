import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';

/**
 * Theme switch with a deliberate circular View Transition reveal.
 * The user's choice is persisted and the switch falls back safely when the
 * View Transitions API is unavailable or reduced motion is requested.
 */
export function AnimatedThemeToggler({ className = '', duration = 1100, fromCenter = false }) {
  const buttonRef = useRef(null);
  const transitionLockRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [theme, setTheme] = useState(() => (
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  ));

  const toggleTheme = () => {
    if (transitionLockRef.current) return;

    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    const rect = buttonRef.current?.getBoundingClientRect();
    const originX = fromCenter ? window.innerWidth / 2 : (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
    const originY = fromCenter ? window.innerHeight / 2 : (rect ? rect.top + rect.height / 2 : window.innerHeight / 2);
    const requestedDuration = Number(duration);
    const safeDuration = Number.isFinite(requestedDuration)
      ? Math.min(1800, Math.max(650, requestedDuration))
      : 1100;

    root.style.setProperty('--theme-toggle-x', originX + 'px');
    root.style.setProperty('--theme-toggle-y', originY + 'px');
    root.style.setProperty('--theme-toggle-duration', safeDuration + 'ms');

    const applyTheme = () => {
      root.classList.toggle('dark', nextTheme === 'dark');
      root.dataset.theme = nextTheme;

      try {
        window.localStorage.setItem('liyaqat:theme', nextTheme);
      } catch {
        // The theme still changes for the current session if storage is blocked.
      }

      const themeColor = document.querySelector('meta[name="theme-color"]');
      themeColor?.setAttribute('content', nextTheme === 'dark' ? '#11120f' : '#f7f6f1');

      flushSync(() => setTheme(nextTheme));
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && typeof document.startViewTransition === 'function') {
      try {
        const transition = document.startViewTransition(applyTheme);
        transitionLockRef.current = true;
        setIsTransitioning(true);

        const releaseLock = () => {
          transitionLockRef.current = false;
          setIsTransitioning(false);
        };
        transition.finished.then(releaseLock, releaseLock);
        return;
      } catch {
        transitionLockRef.current = false;
        setIsTransitioning(false);
        // Fall through to the accessible immediate update.
      }
    }

    applyTheme();
  };

  const isDark = theme === 'dark';

  return (
    <button
      ref={buttonRef}
      type="button"
      className={('animated-theme-toggler ' + className).trim()}
      onClick={toggleTheme}
      disabled={isTransitioning}
      aria-busy={isTransitioning}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
      <span className="sr-only">{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}

export default AnimatedThemeToggler;
