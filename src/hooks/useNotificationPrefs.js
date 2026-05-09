import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'moodboard-notification-prefs';

const defaultPrefs = {
  dailyReminder: false,
  weeklyDigest: false,
};

function readPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        dailyReminder: Boolean(p.dailyReminder),
        weeklyDigest: Boolean(p.weeklyDigest),
      };
    }
  } catch {
    /* ignore */
  }
  return { ...defaultPrefs };
}

function writePrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

let cached = readPrefs();
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((l) => l());
}

export function useNotificationPrefs() {
  const prefs = useSyncExternalStore(
    subscribe,
    () => cached,
    () => defaultPrefs,
  );

  const setPrefs = useCallback((partial) => {
    cached = { ...cached, ...partial };
    writePrefs(cached);
    emit();
  }, []);

  return { prefs, setPrefs };
}
