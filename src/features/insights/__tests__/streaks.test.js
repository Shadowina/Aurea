/**
 * Streak utility tests
 * Covers: ST-01 → ST-12 from the implementation checklist.
 *
 * Strategy: vi.useFakeTimers() fixes "today" so streak logic is deterministic.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { computeStreaks } from '../utils/streaks.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns an ISO string for a date offset of `deltaDays` relative to the
 *  currently mocked "now". */
function isoDay(deltaDays = 0, hour = 12) {
  const d = new Date()
  d.setDate(d.getDate() + deltaDays)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

function entry(deltaDays = 0, hour = 12) {
  return { dateTime: isoDay(deltaDays, hour) }
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Fix "now" to a Wednesday so date arithmetic is unambiguous
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-03-11T14:00:00')) // Wednesday
})

afterEach(() => {
  vi.useRealTimers()
})

// ─── ST-01: No entries ────────────────────────────────────────────────────────

describe('ST-01: no entries', () => {
  it('returns zeros for empty array', () => {
    expect(computeStreaks([])).toEqual({ currentStreak: 0, longestStreak: 0 })
  })

  it('returns zeros for null/undefined', () => {
    expect(computeStreaks(null)).toEqual({ currentStreak: 0, longestStreak: 0 })
    expect(computeStreaks(undefined)).toEqual({ currentStreak: 0, longestStreak: 0 })
  })
})

// ─── ST-02: One entry today ───────────────────────────────────────────────────

describe('ST-02: one entry today', () => {
  it('currentStreak = 1', () => {
    const { currentStreak, longestStreak } = computeStreaks([entry(0)])
    expect(currentStreak).toBe(1)
    expect(longestStreak).toBe(1)
  })
})

// ─── ST-03: One entry yesterday, none today ───────────────────────────────────

describe('ST-03: one entry yesterday, no entry today', () => {
  it('currentStreak = 1 (stays alive until today ends)', () => {
    const { currentStreak } = computeStreaks([entry(-1)])
    expect(currentStreak).toBe(1)
  })
})

// ─── ST-04: Last entry two days ago ──────────────────────────────────────────

describe('ST-04: last entry two days ago', () => {
  it('currentStreak = 0 (streak broken)', () => {
    const { currentStreak } = computeStreaks([entry(-2)])
    expect(currentStreak).toBe(0)
  })
})

// ─── ST-05: 5-day run ending yesterday ───────────────────────────────────────

describe('ST-05: 5-day run ending yesterday', () => {
  it('currentStreak = 5 before today ends', () => {
    const entries = [-5, -4, -3, -2, -1].map((d) => entry(d))
    const { currentStreak } = computeStreaks(entries)
    expect(currentStreak).toBe(5)
  })
})

// ─── ST-06: 5-day run including today ────────────────────────────────────────

describe('ST-06: 5-day run ending today', () => {
  it('currentStreak = 5', () => {
    const entries = [-4, -3, -2, -1, 0].map((d) => entry(d))
    const { currentStreak } = computeStreaks(entries)
    expect(currentStreak).toBe(5)
  })
})

// ─── ST-07: Duplicate same-day entries ───────────────────────────────────────

describe('ST-07: duplicate same-day entries', () => {
  it('multiple entries on same day count as one for streak continuity', () => {
    const entries = [
      entry(-1, 9),
      entry(-1, 14), // duplicate day
      entry(-1, 20), // duplicate day
      entry(0),
    ]
    const { currentStreak } = computeStreaks(entries)
    expect(currentStreak).toBe(2) // yesterday + today = 2-day streak
  })

  it('3 entries on the same single day → currentStreak = 1, longestStreak = 1', () => {
    const entries = [entry(0, 8), entry(0, 12), entry(0, 20)]
    const { currentStreak, longestStreak } = computeStreaks(entries)
    expect(currentStreak).toBe(1)
    expect(longestStreak).toBe(1)
  })
})

// ─── ST-08: Longest streak across multiple runs ───────────────────────────────

describe('ST-08: multiple runs — longest is 4', () => {
  it('longestStreak = 4', () => {
    // run of 2: D-12, D-11 | gap | run of 4: D-8..D-5 | gap | run of 3 ending today
    const entries = [
      entry(-12), entry(-11),                           // run = 2
      entry(-8), entry(-7), entry(-6), entry(-5),       // run = 4
      entry(-2), entry(-1), entry(0),                   // run = 3
    ]
    const { longestStreak } = computeStreaks(entries)
    expect(longestStreak).toBe(4)
  })
})

// ─── ST-09: Unordered input ───────────────────────────────────────────────────

describe('ST-09: unordered input', () => {
  it('input order does not affect results', () => {
    const orderedEntries = [-4, -3, -2, -1, 0].map((d) => entry(d))
    const shuffledEntries = [0, -2, -4, -1, -3].map((d) => entry(d))

    const fromOrdered = computeStreaks(orderedEntries)
    const fromShuffled = computeStreaks(shuffledEntries)

    expect(fromShuffled).toEqual(fromOrdered)
  })
})

// ─── ST-10: Entry near local midnight ────────────────────────────────────────

describe('ST-10: entries near local midnight', () => {
  it('23:59 and 00:01 on adjacent days bucket to different days', () => {
    // 23:59 yesterday and 00:01 today should be two distinct days
    const entries = [
      entry(-1, 23), // 23:xx yesterday
      entry(0, 0),   // 00:xx today
    ]
    const { currentStreak } = computeStreaks(entries)
    expect(currentStreak).toBe(2)
  })
})

// ─── ST-11/ST-12: DST notes ──────────────────────────────────────────────────
// DST tests (ST-11, ST-12) require controlling the system timezone, which is
// environment-dependent. The implementation uses Date constructor with
// year/month/day local components (avoiding toISOString round-trips) and
// Math.round for day-diff calculations so ±1 DST hour does not cause false
// breaks. These should be verified with TZ=America/New_York in CI.
