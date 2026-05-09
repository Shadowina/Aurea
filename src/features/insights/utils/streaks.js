/**
 * Insights — streak computation utilities 
 *
 * ─── Output contract ──────────────────────────────────────────────────────────
 * computeStreaks(entries) → { currentStreak: number, longestStreak: number }
 *
 * ─── Rules ────────────────────────────────────────────────────────────────────
 * • Multiple entries on the same local day count as ONE active day for streak logic.
 * • Current streak:
 *     - Latest logged day === today  → streak is active; count back from today.
 *     - Latest logged day === yesterday → streak stays non-zero through today
 *       (user has until local day end to extend it).
 *     - Latest logged day older than yesterday → currentStreak = 0.
 * • Longest streak: maximum consecutive-day run across all unique logged days.
 * • Input order does not affect results (entries are sorted internally).
 */

import { toLocalDayKey, todayKey, yesterdayKey, resolveEntryTimestamp } from './dateKeys.js'

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Computes current and longest streaks from an array of mood entries.
 * @param {Array<{ dateTime?: string, createdAt?: string }>} entries
 * @returns {{ currentStreak: number, longestStreak: number }}
 */
export function computeStreaks(entries) {
  if (!entries || entries.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  const sortedDays = _uniqueSortedDayKeys(entries)
  if (sortedDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  const latestDay = sortedDays[sortedDays.length - 1]
  const today = todayKey()
  const yesterday = yesterdayKey()

  // ── Current streak ──────────────────────────────────────────────────────────
  let currentStreak = 0
  if (latestDay === today) {
    currentStreak = _countConsecutiveBack(sortedDays, today)
  } else if (latestDay === yesterday) {
    // Streak is still live today — count back from yesterday
    currentStreak = _countConsecutiveBack(sortedDays, yesterday)
  }
  // else: gap > 1 day → streak is broken, stays 0

  // ── Longest streak ──────────────────────────────────────────────────────────
  let longestStreak = 0
  let run = 1
  for (let i = 1; i < sortedDays.length; i++) {
    const diffDays = _daysBetween(sortedDays[i - 1], sortedDays[i])
    if (diffDays === 1) {
      run++
    } else {
      longestStreak = Math.max(longestStreak, run)
      run = 1
    }
  }
  longestStreak = Math.max(longestStreak, run)

  return { currentStreak, longestStreak }
}

// ─── Internals ────────────────────────────────────────────────────────────────

/**
 * Converts entries to an ascending-sorted array of unique local day keys.
 * @param {Array<{ dateTime?: string, createdAt?: string }>} entries
 * @returns {string[]}
 */
export function _uniqueSortedDayKeys(entries) {
  const set = new Set()
  for (const entry of entries) {
    const ts = resolveEntryTimestamp(entry)
    if (ts) set.add(toLocalDayKey(ts))
  }
  return Array.from(set).sort()
}

/**
 * Counts how many consecutive calendar days exist in sortedDays going
 * backward from anchorDay (inclusive).
 * @param {string[]} sortedDays  ascending YYYY-MM-DD array
 * @param {string}   anchorDay   YYYY-MM-DD to start counting back from
 * @returns {number}
 */
function _countConsecutiveBack(sortedDays, anchorDay) {
  const set = new Set(sortedDays)
  let count = 0
  // Use Date constructor with year/month/day to stay in local timezone
  const [y, m, d] = anchorDay.split('-').map(Number)
  const cursor = new Date(y, m - 1, d)

  while (set.has(_dateToLocalKey(cursor))) {
    count++
    cursor.setDate(cursor.getDate() - 1)
  }
  return count
}

/**
 * Returns the number of calendar days between two YYYY-MM-DD keys.
 * Math.round handles DST ±1h so 23h rounds to 1 and 25h rounds to 1.
 * @param {string} keyA
 * @param {string} keyB  (expected to be >= keyA)
 * @returns {number}
 */
function _daysBetween(keyA, keyB) {
  const [ya, ma, da] = keyA.split('-').map(Number)
  const [yb, mb, db] = keyB.split('-').map(Number)
  const a = new Date(ya, ma - 1, da)
  const b = new Date(yb, mb - 1, db)
  return Math.round((b - a) / 86_400_000)
}

/**
 * @param {Date} d
 * @returns {string}  YYYY-MM-DD
 */
function _dateToLocalKey(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
