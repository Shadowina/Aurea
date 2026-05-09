import { useEffect, useMemo, useState } from 'react';
import { todayKey } from '../utils/dateKeys.js';
import { getDailyPromptMeta, setDailyPromptMeta } from '../firestore/dailyPromptMeta.js';
import {
  computePromptOfDay,
  getLatestMoodId,
  resolvePromptWithAdjacentDayGuard,
} from '../utils/promptSelector.js';

/**
 *
 * @param {import('firebase/auth').User | null | undefined} user
 * @param {Array<object>} entries
 * @param {boolean} entriesLoading  MoodContext loading flag for entries subscription
 */
export function useDailyPrompt(user, entries, entriesLoading) {
  const [promptOfDay, setPromptOfDay] = useState(null);
  const [promptLoading, setPromptLoading] = useState(true);

  const entriesSignal = useMemo(() => {
    const mood = getLatestMoodId(entries);
    const headId = entries[0]?.id ?? '';
    const len = entries.length;
    return `${len}|${mood ?? ''}|${headId}`;
  }, [entries]);

  useEffect(() => {
    if (!user?.uid) {
      setPromptOfDay(null);
      setPromptLoading(false);
      return undefined;
    }

    if (entriesLoading) {
      setPromptLoading(true);
      return undefined;
    }

    let cancelled = false;

    async function run() {
      setPromptLoading(true);
      try {
        const meta = await getDailyPromptMeta(user.uid);
        const resolved = resolvePromptWithAdjacentDayGuard(user.uid, entries, meta);
        const today = todayKey();

        if (meta?.promptId === resolved.id && meta?.localDayKey === today) {
          if (!cancelled) setPromptOfDay(resolved);
          return;
        }

        await setDailyPromptMeta(user.uid, {
          promptId: resolved.id,
          localDayKey: today,
        });

        if (!cancelled) setPromptOfDay(resolved);
      } catch (err) {
        console.error('Daily prompt meta failed; falling back to local selector only.', err);
        if (!cancelled) setPromptOfDay(computePromptOfDay(user.uid, entries));
      } finally {
        if (!cancelled) setPromptLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `entries` tracked via entriesSignal
  }, [user?.uid, entriesLoading, entriesSignal]);

  return { promptOfDay, promptLoading };
}
