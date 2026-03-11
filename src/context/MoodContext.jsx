import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

const MoodContext = createContext(undefined);

const toIsoString = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value?.toDate === 'function') return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return null;
};

const normalizeEntry = (id, entry) => {
  const createdAt = toIsoString(entry.createdAt) ?? toIsoString(entry.timestamp) ?? new Date().toISOString();
  const dateTime = entry.dateTime ?? createdAt;
  return {
    id,
    ...entry,
    note: entry.note ?? entry.notes ?? '',
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    dateTime,
    createdAt,
    updatedAt: toIsoString(entry.updatedAt) ?? createdAt,
    favorite: Boolean(entry.favorite),
  };
};

export const MoodProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) {
      setEntries([]);
      setLoading(false);
      setError('');
      return undefined;
    }

    setLoading(true);
    setError('');
    const entriesRef = collection(db, 'users', currentUser.uid, 'entries');
    const entriesQuery = query(entriesRef, orderBy('dateTime', 'desc'));
    const unsubscribe = onSnapshot(
      entriesQuery,
      (snapshot) => {
        const nextEntries = snapshot.docs.map((entryDoc) => normalizeEntry(entryDoc.id, entryDoc.data()));
        setEntries(nextEntries);
        setLoading(false);
      },
      (snapshotError) => {
        console.error('Failed to subscribe to mood entries', snapshotError);
        setError('We could not load your entries right now. Please try again.');
        setEntries([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const addEntry = async (payload) => {
    if (!currentUser?.uid) {
      const authError = new Error('You must be signed in to add an entry.');
      setError(authError.message);
      throw authError;
    }

    setError('');
    const now = new Date().toISOString();
    const entry = {
      favorite: false,
      dateTime: payload.dateTime ?? now,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...payload,
    };

    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'entries'), entry);
    } catch (writeError) {
      console.error('Failed to add mood entry', writeError);
      setError('We could not save your entry. Please try again.');
      throw writeError;
    }
  };

  const toggleFavorite = async (id) => {
    if (!currentUser?.uid) {
      const authError = new Error('You must be signed in to update an entry.');
      setError(authError.message);
      throw authError;
    }

    const target = entries.find((entry) => entry.id === id);
    if (!target) return;
    setError('');

    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'entries', id), {
        favorite: !target.favorite,
        updatedAt: serverTimestamp(),
      });
    } catch (writeError) {
      console.error('Failed to toggle favorite', writeError);
      setError('We could not update this favorite right now. Please try again.');
      throw writeError;
    }
  };

  const removeEntry = async (id) => {
    if (!currentUser?.uid) {
      const authError = new Error('You must be signed in to remove an entry.');
      setError(authError.message);
      throw authError;
    }

    setError('');
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'entries', id));
    } catch (deleteError) {
      console.error('Failed to remove entry', deleteError);
      setError('We could not delete this entry right now. Please try again.');
      throw deleteError;
    }
  };

  const value = useMemo(
    () => ({
      entries,
      loading,
      error,
      addEntry,
      toggleFavorite,
      removeEntry,
      favorites: entries.filter((entry) => entry.favorite),
    }),
    [entries, loading, error],
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

