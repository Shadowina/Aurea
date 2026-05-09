import { useContext } from 'react';
import { MoodContext } from './moodContext.js';

export function useMoods() {
  const ctx = useContext(MoodContext);
  if (!ctx) {
    throw new Error('useMoods must be used within a MoodProvider');
  }
  return ctx;
}
