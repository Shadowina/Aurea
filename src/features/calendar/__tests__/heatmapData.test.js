import { describe, expect, it } from 'vitest';
import { buildHeatmapMatrix, countToLevel } from '../utils/heatmapData.js';

describe('countToLevel', () => {
  it('returns 0 for zero count', () => {
    expect(countToLevel(0, 10)).toBe(0);
  });

  it('scales relative to max', () => {
    expect(countToLevel(10, 10)).toBe(4);
    expect(countToLevel(5, 10)).toBeGreaterThanOrEqual(2);
  });
});

describe('buildHeatmapMatrix', () => {
  it('returns weeks grid with 7 rows per column', () => {
    const { weeks, rowLabels } = buildHeatmapMatrix([], 4);
    expect(rowLabels).toHaveLength(7);
    expect(weeks).toHaveLength(4);
    expect(weeks[0].cells).toHaveLength(7);
  });
});
