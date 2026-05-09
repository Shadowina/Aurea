import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase.js';

const DAILY_PROMPT_DOC = 'dailyPrompt';

/**
 * @param {string} uid
 * @returns {Promise<{ promptId: string, localDayKey: string } | null>}
 */
export async function getDailyPromptMeta(uid) {
  const ref = doc(db, 'users', uid, 'meta', DAILY_PROMPT_DOC);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  const promptId = typeof d.promptId === 'string' ? d.promptId : null;
  const localDayKey = typeof d.localDayKey === 'string' ? d.localDayKey : null;
  if (!promptId || !localDayKey) return null;
  return { promptId, localDayKey };
}

/**
 * @param {string} uid
 * @param {{ promptId: string, localDayKey: string }} payload
 */
export async function setDailyPromptMeta(uid, payload) {
  const ref = doc(db, 'users', uid, 'meta', DAILY_PROMPT_DOC);
  await setDoc(ref, payload, { merge: true });
}
