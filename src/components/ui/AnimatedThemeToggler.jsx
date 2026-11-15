import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';

/**
 * Magic UI-style theme switch with a circular View Transition reveal.
 * The theme is stored locally and falls back to an instant switch in browsers
 * that do not support the View Transitions API or when reduced motion is on.
 */
export function AnimatedThemeToggler({ className = '', duration = 400, fromCenter = false }) {
  const buttonRef = useRef(null);
  const [theme, setTheme] = useState(() => (
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  ));

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    const rect = buttonRef.current?.getBoundingClientRect();
    const originX = fromCenter ? window.innerWidth / 2 : (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
    const originY = fromCenter ? window.innerHeight / 2 : (rect ? rect.top + rect.height / 2 : window.innerHeight / 2);
    const safeDuration = Math.max(0, Number(duration) || 400);

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
        document.startViewTransition(applyTheme);
        return;
      } catch {
        // Fall through to the accessible instant update in unsupported engines.
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
