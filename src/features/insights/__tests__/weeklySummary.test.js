/**
 * Weekly summary utility tests
 * Covers: WK-01 → WK-04 from the implementation checklist.
 *
 * Strategy: vi.useFakeTimers() fixes "now" to a known Wednesday so week
 * boundaries (Mon–Sun) are deterministic.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { computeWeeklySummary } from '../utils/weeklySummary.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fixed reference: 2026-03-11 (Wednesday).
 * Current week: Mon 2026-03-09 00:00 → Sun 2026-03-15 23:59:59.999 local.
 */
const FIXED_NOW = new Date('2026-03-11T14:00:00')

function iso(year, month, day, hour = 12) {
  return new Date(year, month - 1, day, hour, 0, 0, 0).toISOString()
}

function entry(year, month, day, hour = 12) {
  return { dateTime: iso(year, month, day, hour) }
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

// ─── WK-01: Empty week ────────────────────────────────────────────────────────

describe('WK-01: empty week', () => {
  it('returns 0 for empty array', () => {
    expect(computeWeeklySummary([])).toEqual({ entriesThisWeek: 0 })
  })

  it('returns 0 for null/undefined', () => {
    expect(computeWeeklySummary(null)).toEqual({ entriesThisWeek: 0 })
    expect(computeWeeklySummary(undefined)).toEqual({ entriesThisWeek: 0 })
  })
})

// ─── WK-02: Multiple entries same day ────────────────────────────────────────

describe('WK-02: multiple entries on the same day', () => {
  it('counts all 4 entries (not unique days)', () => {
    const entries = [
      entry(2026, 3, 10, 8),   // Monday in week
      entry(2026, 3, 10, 12),  // Monday in week
      entry(2026, 3, 10, 16),  // Monday in week
      entry(2026, 3, 10, 20),  // Monday in week
    ]
    expect(computeWeeklySummary(entries)).toEqual({ entriesThisWeek: 4 })
  })
})

// ─── WK-03: Week boundary inclusion ──────────────────────────────────────────

describe('WK-03: week boundary inclusion', () => {
  it('counts entry on Monday (week start)', () => {
    // Monday 00:00:00 local = week start
    const entries = [entry(2026, 3, 9, 0)]
    expect(computeWeeklySummary(entries)).toEqual({ entriesThisWeek: 1 })
  })

  it('counts entry on Sunday (week end)', () => {
    // Sunday 23:00 local = within week end
    const entries = [entry(2026, 3, 15, 23)]
    expect(computeWeeklySummary(entries)).toEqual({ entriesThisWeek: 1 })
  })

  it('counts entries across full span of week', () => {
    const entries = [
      entry(2026, 3, 9),  // Mon
      entry(2026, 3, 11), // Wed (today)
      entry(2026, 3, 15), // Sun
    ]
    expect(computeWeeklySummary(entries)).toEqual({ entriesThisWeek: 3 })
  })
})

// ─── WK-04: Cross-week exclusion ─────────────────────────────────────────────

describe('WK-04: entries outside current week are excluded', () => {
  it('excludes entry from the day before week start (last Sunday)', () => {
    // Sunday 2026-03-08 is BEFORE the current week (Mon 2026-03-09)
    const entries = [entry(2026, 3, 8)]
    expect(computeWeeklySummary(entries)).toEqual({ entriesThisWeek: 0 })
  })

  it('excludes entries from prior weeks and counts only current-week entries', () => {
    const entries = [
      entry(2026, 3, 2),  // prior week Mon
      entry(2026, 3, 8),  // prior week Sun
      entry(2026, 3, 9),  // current week Mon  ← in
      entry(2026, 3, 11), // current week Wed  ← in
    ]
    expect(computeWeeklySummary(entries)).toEqual({ entriesThisWeek: 2 })
  })

  it('excludes entries from next week', () => {
    const entries = [
      entry(2026, 3, 11), // current week Wed ← in
      entry(2026, 3, 16), // next week Mon    ← out
    ]
    expect(computeWeeklySummary(entries)).toEqual({ entriesThisWeek: 1 })
  })
})
