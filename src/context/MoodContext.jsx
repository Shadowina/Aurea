import { useCallback, useEffect, useMemo, useState } from 'react';
import { getFirestoreUserMessage } from '../utils/firestoreErrors.js';
import {
  addUserEntry,
  deleteUserEntry,
  setEntryFavorite,
  subscribeUserEntries,
  updateUserEntry,
} from '../services/moodService.js';
import { MoodContext } from './moodContext.js';
import { useAuth } from './useAuth.js';

export const MoodProvider = ({ children }) => {
  const { user: currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser?.uid) {
      setEntries([]);
      setLoading(false);
      setError('');
      return undefined;
    }

    setLoading(true);
    setError('');
    const unsubscribe = subscribeUserEntries(
      currentUser.uid,
      (nextEntries) => {
        setEntries(nextEntries);
        setLoading(false);
        setError('');
      },
      (snapshotError) => {
        console.error('Failed to subscribe to mood entries', snapshotError);
        setError(
          getFirestoreUserMessage(snapshotError, 'We could not load your entries right now. Please try again.'),
        );
        setEntries([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const addEntry = useCallback(async (payload) => {
    if (!currentUser?.uid) {
      const authError = new Error('You must be signed in to add an entry.');
      setError(authError.message);
      throw authError;
    }

    setError('');

    try {
      await addUserEntry(currentUser.uid, payload);
    } catch (writeError) {
      console.error('Failed to add mood entry', writeError);
      const msg = getFirestoreUserMessage(writeError, 'We could not save your entry. Please try again.');
      setError(msg);
      throw new Error(msg);
    }
  }, [currentUser?.uid]);

  const toggleFavorite = useCallback(async (id) => {
    if (!currentUser?.uid) {
      const authError = new Error('You must be signed in to update an entry.');
      setError(authError.message);
      throw authError;
    }

    const target = entries.find((entry) => entry.id === id);
    if (!target) return;
    setError('');

    try {
      await setEntryFavorite(currentUser.uid, id, !target.favorite);
    } catch (writeError) {
      console.error('Failed to toggle favorite', writeError);
      const msg = getFirestoreUserMessage(writeError, 'We could not update this favorite right now. Please try again.');
      setError(msg);
      throw new Error(msg);
    }
  }, [currentUser?.uid, entries]);

  const removeEntry = useCallback(async (id) => {
    if (!currentUser?.uid) {
      const authError = new Error('You must be signed in to remove an entry.');
      setError(authError.message);
      throw authError;
    }

    setError('');
    try {
      await deleteUserEntry(currentUser.uid, id);
    } catch (deleteError) {
      console.error('Failed to remove entry', deleteError);
      const msg = getFirestoreUserMessage(deleteError, 'We could not delete this entry right now. Please try again.');
      setError(msg);
      throw new Error(msg);
    }
  }, [currentUser?.uid]);

  const updateEntry = useCallback(async (id, patch) => {
    if (!currentUser?.uid) {
      const authError = new Error('You must be signed in to update an entry.');
      setError(authError.message);
      throw authError;
    }

    setError('');
    try {
      await updateUserEntry(currentUser.uid, id, patch);
    } catch (writeError) {
      console.error('Failed to update mood entry', writeError);
      const msg = getFirestoreUserMessage(writeError, 'We could not save your changes. Please try again.');
      setError(msg);
      throw new Error(msg);
    }
  }, [currentUser?.uid]);

  const value = useMemo(
    () => ({
      entries,
      loading,
      error,
      addEntry,
      updateEntry,
      toggleFavorite,
      removeEntry,
      favorites: entries.filter((entry) => entry.favorite),
    }),
    [entries, loading, error, addEntry, updateEntry, toggleFavorite, removeEntry],
  );

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};
