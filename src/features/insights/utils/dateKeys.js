/**
 * Insights — date/timezone utilities  (Phase 1: Foundations)
 *
 * ─── Input contract ───────────────────────────────────────────────────────────
 * Every entry passed to insight utilities must provide at minimum:
 *   dateTime  : string  — ISO 8601 (user-selected moment). Primary timestamp.
 *   createdAt : string  — ISO 8601 fallback if dateTime is absent.
 *
 * ─── Timezone policy ──────────────────────────────────────────────────────────
 * V1 uses the browser's local timezone exclusively.
 * Day keys, streak windows, week boundaries, and prompt seeds all derive from
 * the same local-timezone interpretation of a timestamp.
 * (No UTC-normalisation; DST edge cases are handled by Math.round where needed.)
 *
 * ─── Week start policy ────────────────────────────────────────────────────────
 * Weeks start on Monday (ISO 8601 week convention).
 * A week runs Monday 00:00:00.000 → Sunday 23:59:59.999 local time.
 *
 * ─── Output contracts ─────────────────────────────────────────────────────────
 * summary    : { currentStreak: number, longestStreak: number, entriesThisWeek: number }
 * promptOfDay: { id: string, text: string, source: 'generic' | 'mood', moodIdUsed: string | null }
 */

/**
 * Converts an ISO datetime string to a YYYY-MM-DD key in the browser's local timezone.
 * @param {string} isoString
 * @returns {string}  e.g. "2026-03-13"
 */
export function toLocalDayKey(isoString) {
  const d = new Date(isoString)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Returns today's YYYY-MM-DD key in local timezone.
 * @returns {string}
 */
export function todayKey() {
  const d = new Date()
  return localDayKeyFromDate(d)
}

/**
 * Returns yesterday's YYYY-MM-DD key in local timezone.
 * @returns {string}
 */
export function yesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return localDayKeyFromDate(d)
}

/**
 * YYYY-MM-DD for a local calendar {@link Date} (midnight boundaries use this date’s wall clock).
 * @param {Date} d
 * @returns {string}
 */
export function localDayKeyFromDate(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Returns the start and end of the current local week as Date objects.
 * Start: Monday 00:00:00.000 local.
 * End  : Sunday 23:59:59.999 local.
 * @returns {{ weekStart: Date, weekEnd: Date }}
 */
export function getLocalWeekBounds() {
  const now = new Date()
  // getDay(): 0=Sun … 6=Sat  →  ISO day: 1=Mon … 7=Sun
  const isoDay = now.getDay() === 0 ? 7 : now.getDay()

  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (isoDay - 1), 0, 0, 0, 0)
  const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (isoDay - 1) + 6, 23, 59, 59, 999)

  return { weekStart, weekEnd }
}

/**
 * Resolves the best available timestamp from an entry object.
 * Prefers dateTime; falls back to createdAt.
 * @param {{ dateTime?: string, createdAt?: string }} entry
 * @returns {string | null}
 */
export function resolveEntryTimestamp(entry) {
  return entry.dateTime || entry.createdAt || null
}
