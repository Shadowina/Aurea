import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { ThemeContext } from './themeContext.js';

const STORAGE_KEY = 'moodboard-theme';

/** @returns {'light' | 'dark'} */
function readStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch {
    /* ignore storage */
  }
  return 'light';
}

function applyDomTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readStoredTheme());

  useLayoutEffect(() => {
    applyDomTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    const resolved = next === 'dark' ? 'dark' : 'light';
    applyDomTheme(resolved);
    setThemeState(resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      applyDomTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
