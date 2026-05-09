
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  computePromptOfDay,
  getLatestMoodId,
  hashToIndex,
  resolvePromptWithAdjacentDayGuard,
  selectPromptOfDay,
} from '../utils/promptSelector.js';
import { todayKey, yesterdayKey } from '../utils/dateKeys.js';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-05-09T12:00:00'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('hashToIndex', () => {
  it('returns a value in range for any non-empty string', () => {
    expect(hashToIndex('a', 5)).toBeGreaterThanOrEqual(0);
    expect(hashToIndex('a', 5)).toBeLessThan(5);
  });
});

describe('getLatestMoodId', () => {
  it('returns null for empty or missing entries', () => {
    expect(getLatestMoodId([])).toBeNull();
    expect(getLatestMoodId(null)).toBeNull();
  });

  it('returns moodId from the chronologically latest entry', () => {
    const entries = [
      { dateTime: '2026-05-08T10:00:00.000Z', moodId: 'peaceful' },
      { dateTime: '2026-05-09T11:00:00.000Z', moodId: 'playful' },
      { dateTime: '2026-05-07T15:00:00.000Z', moodId: 'joyful' },
    ];
    expect(getLatestMoodId(entries)).toBe('playful');
  });

  it('ignores entries without moodId when determining latest with timestamp', () => {
    const entries = [
      { dateTime: '2026-05-09T12:00:00.000Z' },
      { dateTime: '2026-05-08T10:00:00.000Z', moodId: 'grounded' },
    ];
    expect(getLatestMoodId(entries)).toBe('grounded');
  });
});

describe('PR-01: determinism (same user, same day, same mood)', () => {
  it('returns the same prompt for identical inputs', () => {
    const a = selectPromptOfDay({
      userId: 'user-a',
      localDayKey: '2026-05-09',
      latestMoodId: 'reflective',
    });
    const b = selectPromptOfDay({
      userId: 'user-a',
      localDayKey: '2026-05-09',
      latestMoodId: 'reflective',
    });
    expect(a).toEqual(b);
  });
});

describe('PR-02: per-user stability', () => {
  it('may differ for different userIds on the same day', () => {
    const u1 = selectPromptOfDay({
      userId: 'uid-one',
      localDayKey: '2026-05-09',
      latestMoodId: null,
    });
    const u2 = selectPromptOfDay({
      userId: 'uid-two',
      localDayKey: '2026-05-09',
      latestMoodId: null,
    });
    expect(u1.id === u2.id && u1.text === u2.text).toBe(false);
  });
});

describe('PR-03: rotation when day changes', () => {
  it('may change prompt when localDayKey changes (same user)', () => {
    const d1 = selectPromptOfDay({
      userId: 'same',
      localDayKey: '2026-05-09',
      latestMoodId: null,
    });
    const d2 = selectPromptOfDay({
      userId: 'same',
      localDayKey: '2026-05-10',
      latestMoodId: null,
    });
    expect(d1.id === d2.id && d1.text === d2.text).toBe(false);
  });
});

describe('PR-04: mood-aware pool', () => {
  it('uses mood source when latestMoodId has a pool', () => {
    const p = selectPromptOfDay({
      userId: 'u',
      localDayKey: '2026-05-09',
      latestMoodId: 'peaceful',
    });
    expect(p.source).toBe('mood');
    expect(p.moodIdUsed).toBe('peaceful');
    expect(p.id.startsWith('peaceful-')).toBe(true);
  });
});

describe('PR-05: unknown mood fallback', () => {
  it('falls back to generic when moodId has no pool', () => {
    const p = selectPromptOfDay({
      userId: 'u',
      localDayKey: '2026-05-09',
      latestMoodId: 'totally-unknown-mood',
    });
    expect(p.source).toBe('generic');
    expect(p.moodIdUsed).toBeNull();
    expect(p.id.startsWith('gen-')).toBe(true);
  });
});

describe('PR-06: no entries / no mood', () => {
  it('computePromptOfDay uses generic when there are no entries', () => {
    const p = computePromptOfDay('user-xyz', []);
    expect(p.source).toBe('generic');
    expect(p.moodIdUsed).toBeNull();
  });
});

describe('PR-07: adjacent-day guard', () => {
  it('avoids repeating yesterday prompt id when meta matches yesterday', () => {
    const uid = 'pr07-user';
    const entries = [];
    const primary = selectPromptOfDay({
      userId: uid,
      localDayKey: todayKey(),
      latestMoodId: null,
    });
    const resolved = resolvePromptWithAdjacentDayGuard(uid, entries, {
      promptId: primary.id,
      localDayKey: yesterdayKey(),
    });
    expect(resolved.id).not.toBe(primary.id);
  });

  it('keeps primary when stored localDayKey is not yesterday', () => {
    const uid = 'pr07-stable';
    const entries = [];
    const primary = selectPromptOfDay({
      userId: uid,
      localDayKey: todayKey(),
      latestMoodId: null,
    });
    const resolved = resolvePromptWithAdjacentDayGuard(uid, entries, {
      promptId: primary.id,
      localDayKey: '2024-01-01',
    });
    expect(resolved.id).toBe(primary.id);
  });
});
