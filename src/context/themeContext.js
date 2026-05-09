import { createContext } from 'react';

/** @typedef {'light' | 'dark'} Theme */

/** @type {import('react').Context<{ theme: Theme; setTheme: (t: Theme) => void; toggleTheme: () => void } | undefined>} */
export const ThemeContext = createContext(undefined);
