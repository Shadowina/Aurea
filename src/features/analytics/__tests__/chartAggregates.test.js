import { describe, expect, it } from 'vitest';
import { buildDailyEntryCounts, buildMoodDistribution } from '../utils/chartAggregates.js';

describe('buildMoodDistribution', () => {
  it('counts by mood id and assigns labels', () => {
    const rows = buildMoodDistribution([
      { moodId: 'peaceful', moodLabel: 'Peaceful' },
      { moodId: 'peaceful', moodLabel: 'Peaceful' },
      { moodId: 'joyful', moodLabel: 'Joyful' },
    ]);
    expect(rows.find((r) => r.moodId === 'peaceful')?.value).toBe(2);
    expect(rows.find((r) => r.moodId === 'joyful')?.value).toBe(1);
    expect(rows[0].value).toBeGreaterThanOrEqual(rows[1]?.value ?? 0);
  });
});

describe('buildDailyEntryCounts', () => {
  it('returns fixed-length series with counts for matching days', () => {
    const day = new Date();
    day.setHours(12, 0, 0, 0);
    const iso = day.toISOString();
    const rows = buildDailyEntryCounts([{ dateTime: iso }], 3);
    expect(rows).toHaveLength(3);
    const hit = rows.find((r) => r.count >= 1);
    expect(hit).toBeDefined();
  });
});
