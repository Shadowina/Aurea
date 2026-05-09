import { getMoodById } from '../../../constants/moods.js';
import { localDayKeyFromDate, resolveEntryTimestamp, todayKey, toLocalDayKey } from '../../insights/utils/dateKeys.js';

/** Monday 00:00 local for the week that contains `d`. */
function startOfMondayWeek(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const isoDay = x.getDay() === 0 ? 7 : x.getDay();
  x.setDate(x.getDate() - (isoDay - 1));
  x.setHours(0, 0, 0, 0);
  return x;
}

function dominantMood(moodIds) {
  if (!moodIds?.length) return null;
  const tally = new Map();
  for (const id of moodIds) {
    tally.set(id, (tally.get(id) ?? 0) + 1);
  }
  let best = null;
  let bestN = 0;
  for (const [id, n] of tally) {
    if (n > bestN || (n === bestN && id < best)) {
      bestN = n;
      best = id;
    }
  }
  return best;
}

/**
 * Maps entry count to visual level 0–4 relative to the hottest day in range.
 * @param {number} count
 * @param {number} maxCount
 */
export function countToLevel(count, maxCount) {
  if (count <= 0 || maxCount <= 0) return 0;
  const t = count / maxCount;
  if (t <= 0.2) return 1;
  if (t <= 0.4) return 2;
  if (t <= 0.6) return 3;
  return 4;
}

/**
 * Columns = consecutive weeks (Mon→Sun rows), oldest week left, newest right.
 * @param {object[]} entries
 * @param {number} numWeeks
 * @returns {{
 *   weeks: { cells: { dayKey: string; date: Date; count: number; level: number; dominantMoodId: string | null; moodSwatch: string | null; isFuture: boolean }[] }[];
 *   maxCount: number;
 *   rowLabels: string[];
 * }}
 */
export function buildHeatmapMatrix(entries, numWeeks = 26) {
  const countByDay = new Map();
  const moodsByDay = new Map();

  for (const e of entries) {
    const ts = resolveEntryTimestamp(e);
    if (!ts) continue;
    const key = toLocalDayKey(ts);
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
    if (!moodsByDay.has(key)) moodsByDay.set(key, []);
    if (e.moodId) moodsByDay.get(key).push(e.moodId);
  }

  const maxCount = Math.max(1, ...countByDay.values());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayK = todayKey();

  const endMonday = startOfMondayWeek(today);
  const startMonday = new Date(endMonday);
  startMonday.setDate(startMonday.getDate() - (numWeeks - 1) * 7);

  /** @type {{ cells: object[] }[]} */
  const weeks = [];

  for (let w = 0; w < numWeeks; w += 1) {
    const cells = [];
    const weekMonday = new Date(startMonday);
    weekMonday.setDate(weekMonday.getDate() + w * 7);

    for (let r = 0; r < 7; r += 1) {
      const cellDate = new Date(weekMonday);
      cellDate.setDate(cellDate.getDate() + r);
      const dayKey = localDayKeyFromDate(cellDate);
      const isFuture = dayKey > todayK;

      if (isFuture) {
        cells.push({
          dayKey,
          date: cellDate,
          count: 0,
          level: 0,
          dominantMoodId: null,
          moodSwatch: null,
          isFuture: true,
        });
        continue;
      }

      const count = countByDay.get(dayKey) ?? 0;
      const domId = dominantMood(moodsByDay.get(dayKey) ?? []);
      const meta = domId ? getMoodById(domId) : null;

      cells.push({
        dayKey,
        date: cellDate,
        count,
        level: countToLevel(count, maxCount),
        dominantMoodId: domId,
        moodSwatch: meta?.swatch ?? null,
        isFuture: false,
      });
    }

    weeks.push({ cells });
  }

  const rowLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return { weeks, maxCount, rowLabels };
}
