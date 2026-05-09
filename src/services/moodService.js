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
import { db } from '../config/firebase.js';
import { USER_ENTRIES_COLLECTION } from '../config/firestorePaths.js';

const toIsoString = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value?.toDate === 'function') return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return null;
};

/**
 * Normalizes a Firestore mood entry document into the shape used across the app.
 * @param {string} id
 * @param {Record<string, unknown>} entry
 */
export function normalizeEntry(id, entry) {
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
}

/**
 * Subscribes to the signed-in user's mood entries (newest first).
 * @param {string} uid
 * @param {(entries: object[]) => void} onNext
 * @param {(error: { code?: string; message?: string }) => void} onError
 * @returns {() => void} unsubscribe
 */
export function subscribeUserEntries(uid, onNext, onError) {
  const entriesRef = collection(db, 'users', uid, USER_ENTRIES_COLLECTION);
  const entriesQuery = query(entriesRef, orderBy('dateTime', 'desc'));
  return onSnapshot(
    entriesQuery,
    (snapshot) => {
      const nextEntries = snapshot.docs.map((entryDoc) => normalizeEntry(entryDoc.id, entryDoc.data()));
      onNext(nextEntries);
    },
    onError,
  );
}

/**
 * @param {string} uid
 * @param {Record<string, unknown>} payload
 */
export async function addUserEntry(uid, payload) {
  const now = new Date().toISOString();
  const entry = {
    favorite: false,
    dateTime: payload.dateTime ?? now,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...payload,
  };
  await addDoc(collection(db, 'users', uid, USER_ENTRIES_COLLECTION), entry);
}

/**
 * @param {string} uid
 * @param {string} entryId
 * @param {boolean} favorite
 */
export async function setEntryFavorite(uid, entryId, favorite) {
  await updateDoc(doc(db, 'users', uid, USER_ENTRIES_COLLECTION, entryId), {
    favorite,
    updatedAt: serverTimestamp(),
  });
}

/**
 * @param {string} uid
 * @param {string} entryId
 */
export async function deleteUserEntry(uid, entryId) {
  await deleteDoc(doc(db, 'users', uid, USER_ENTRIES_COLLECTION, entryId));
}

/**
 * Partial update for an existing mood entry (does not replace the whole document).
 * @param {string} uid
 * @param {string} entryId
 * @param {Record<string, unknown>} patch Field updates (note, moodId, tags, etc.)
 */
export async function updateUserEntry(uid, entryId, patch) {
  await updateDoc(doc(db, 'users', uid, USER_ENTRIES_COLLECTION, entryId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}
