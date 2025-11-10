import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'moodboardme.entries';

const MoodContext = createContext(undefined);

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
};

const readFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => ({
      ...entry,
      note: entry.note ?? entry.notes ?? '',
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      createdAt: entry.createdAt ?? entry.timestamp ?? new Date().toISOString(),
      favorite: Boolean(entry.favorite),
    }));
  } catch (error) {
    console.error('Failed to load mood entries', error);
    return [];
  }
};

const writeToStorage = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to persist mood entries', error);
  }
};

export const MoodProvider = ({ children }) => {
  const [entries, setEntries] = useState(() => readFromStorage());

  useEffect(() => {
    writeToStorage(entries);
  }, [entries]);

  const addEntry = (payload) => {
    const entry = {
      id: generateId(),
      favorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    setEntries((prev) => [entry, ...prev]);
  };

  const toggleFavorite = (id) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, favorite: !entry.favorite, updatedAt: new Date().toISOString() } : entry,
      ),
    );
  };

  const removeEntry = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const value = useMemo(
    () => ({
      entries,
      addEntry,
      toggleFavorite,
      removeEntry,
      favorites: entries.filter((entry) => entry.favorite),
    }),
    [entries],
  );

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export const useMoods = () => {
  const ctx = useContext(MoodContext);
  if (!ctx) {
    throw new Error('useMoods must be used within a MoodProvider');
  }
  return ctx;
};

