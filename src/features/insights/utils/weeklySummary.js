/**
 * Insights — weekly summary utilities
 *
 * ─── Output contract ──────────────────────────────────────────────────────────
 * computeWeeklySummary(entries) → { entriesThisWeek: number }
 *
 * ─── Rules ────────────────────────────────────────────────────────────────────
 * • Week starts Monday 00:00:00.000 local, ends Sunday 23:59:59.999 local.
 * • ALL entries within the current week are counted (not unique days).
 *   Three entries on Monday = 3, not 1.
 * • Entries outside the current week are excluded.
 */

import { getLocalWeekBounds, resolveEntryTimestamp } from './dateKeys.js'

/**
 * Counts all entries whose timestamp falls within the current local week.
 * @param {Array<{ dateTime?: string, createdAt?: string }>} entries
 * @returns {{ entriesThisWeek: number }}
 */
export function computeWeeklySummary(entries) {
  if (!entries || entries.length === 0) return { entriesThisWeek: 0 }

  const { weekStart, weekEnd } = getLocalWeekBounds()
  const start = weekStart.getTime()
  const end = weekEnd.getTime()
  let count = 0

  for (const entry of entries) {
    const ts = resolveEntryTimestamp(entry)
    if (!ts) continue
    const t = new Date(ts).getTime()
    if (t >= start && t <= end) count++
  }

  return { entriesThisWeek: count }
}
