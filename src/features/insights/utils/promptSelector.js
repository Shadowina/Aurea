
import { GENERIC_PROMPTS, MOOD_PROMPTS } from '../constants/reflectionPrompts.js';
import { resolveEntryTimestamp, todayKey, yesterdayKey } from './dateKeys.js';

/** @typedef {{ id: string, text: string, source: 'generic' | 'mood', moodIdUsed: string | null }} PromptOfDay */

/**
 * FNV-1a style 32-bit hash → stable non-negative index.
 * @param {string} str
 * @param {number} modulus  positive integer
 * @returns {number}
 */
export function hashToIndex(str, modulus) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % modulus;
}

/**
 * Latest mood: walks entries newest-first and returns the first `moodId` present.
 * (Skips newest rows that lack `moodId`, e.g. legacy data.)
 * @param {Array<{ dateTime?: string, createdAt?: string, moodId?: string }>} entries
 * @returns {string | null}
 */
export function getLatestMoodId(entries) {
  if (!entries?.length) return null;

  const sorted = [...entries].sort((a, b) => {
    const ta = resolveEntryTimestamp(a);
    const tb = resolveEntryTimestamp(b);
    if (!ta && !tb) return 0;
    if (!ta) return 1;
    if (!tb) return -1;
    return new Date(tb).getTime() - new Date(ta).getTime();
  });

  for (const entry of sorted) {
    const id = entry?.moodId;
    if (typeof id === 'string' && id.length > 0) return id;
  }
  return null;
}

/**
 * Picks today’s reflection prompt for a user from entries + clock (local today).
 * @param {string} userId
 * @param {Array<{ dateTime?: string, createdAt?: string, moodId?: string }>} entries
 * @returns {PromptOfDay}
 */
export function computePromptOfDay(userId, entries) {
  const localDayKey = todayKey();
  const latestMoodId = getLatestMoodId(entries);
  return selectPromptOfDay({ userId, localDayKey, latestMoodId });
}

/**
 * Deterministic prompt selection (inject localDayKey for tests).
 * @param {{ userId: string, localDayKey: string, latestMoodId: string | null }} params
 * @returns {PromptOfDay}
 */
/**
 * Avoids serving the same prompt id two local days in a row when yesterday’s
 * stored prompt matches today’s primary pick. Retries use a salted day key.
 *
 * @param {string} userId
 * @param {Array<{ dateTime?: string, createdAt?: string, moodId?: string }>} entries
 * @param {{ promptId?: string | null, localDayKey?: string | null } | null | undefined} storedMeta  From Firestore `meta/dailyPrompt`
 * @returns {PromptOfDay}
 */
export function resolvePromptWithAdjacentDayGuard(userId, entries, storedMeta) {
  const localDayKey = todayKey();
  const latestMoodId = getLatestMoodId(entries);
  const primary = selectPromptOfDay({ userId, localDayKey, latestMoodId });

  const lastPromptId = storedMeta?.promptId ?? null;
  const lastDayKey = storedMeta?.localDayKey ?? null;
  const y = yesterdayKey();

  if (lastDayKey !== y || !lastPromptId || lastPromptId !== primary.id) {
    return primary;
  }

  for (let attempt = 1; attempt <= 24; attempt += 1) {
    const alt = selectPromptOfDay({
      userId,
      localDayKey: `${localDayKey}|nr${attempt}`,
      latestMoodId,
    });
    if (alt.id !== primary.id) return alt;
  }

  return primary;
}

export function selectPromptOfDay({ userId, localDayKey, latestMoodId }) {
  const moodPool =
    latestMoodId && Array.isArray(MOOD_PROMPTS[latestMoodId]) && MOOD_PROMPTS[latestMoodId].length > 0
      ? MOOD_PROMPTS[latestMoodId]
      : null;

  const pool = moodPool ?? GENERIC_PROMPTS;
  const source = moodPool ? 'mood' : 'generic';
  const moodIdUsed = moodPool ? latestMoodId : null;

  const seed = `${userId}|${localDayKey}|${latestMoodId ?? ''}`;
  const idx = hashToIndex(seed, pool.length);
  const item = pool[idx];

  return {
    id: item.id,
    text: item.text,
    source,
    moodIdUsed,
  };
}
