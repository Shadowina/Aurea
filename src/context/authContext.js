import { createContext } from 'react';

/** @type {import('react').Context<{ user: import('firebase/auth').User | null; loading: boolean } | undefined>} */
export const AuthContext = createContext(undefined);
