import { getMoodById } from '../../../constants/moods.js';
import { resolveEntryTimestamp, toLocalDayKey } from '../../insights/utils/dateKeys.js';

/**
 * Data for a pie chart of mood labels (counts per mood id).
 * @param {object[]} entries
 * @returns {{ moodId: string, name: string, value: number, color: string }[]}
 */
export function buildMoodDistribution(entries) {
  const counts = new Map();
  for (const e of entries) {
    const id = e.moodId || 'unknown';
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([moodId, value]) => {
      const meta = getMoodById(moodId);
      return {
        moodId,
        name: meta?.label ?? (moodId === 'unknown' ? 'Other' : moodId),
        value,
        color: meta?.swatch ?? '#94a3b8',
      };
    })
    .sort((a, b) => b.value - a.value);
}

/**
 * Daily entry counts for the last `days` local calendar days (including today).
 * @param {object[]} entries
 * @param {number} days
 * @returns {{ dayKey: string, label: string, count: number }[]}
 */
export function buildDailyEntryCounts(entries, days = 14) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /** @type {{ dayKey: string; label: string; count: number }[]} */
  const buckets = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dayKey = `${y}-${m}-${day}`;
    buckets.push({
      dayKey,
      label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      count: 0,
    });
  }

  const idxByKey = Object.fromEntries(buckets.map((b, i) => [b.dayKey, i]));
  const validKeys = new Set(buckets.map((b) => b.dayKey));

  for (const e of entries) {
    const ts = resolveEntryTimestamp(e);
    if (!ts) continue;
    const key = toLocalDayKey(ts);
    if (!validKeys.has(key)) continue;
    const idx = idxByKey[key];
    buckets[idx].count += 1;
  }

  return buckets;
}
