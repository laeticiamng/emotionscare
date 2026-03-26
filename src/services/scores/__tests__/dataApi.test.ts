// @ts-nocheck
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  aggregateWeeklySessions,
  buildHeatmap,
  computeSeriesSummary,
  hasAnySessions,
  hasAnyVibes,
  hasMeaningfulMood,
  mapMoodPoints,
  smooth,
} from '../dataApi';

describe('smooth', () => {
  it('applies moving average and ignores undefined values', () => {
    const values = [0.4, undefined, 0.8, 0.6];
    const result = smooth(values, 3);
    expect(result[0]).toBeCloseTo(0.4, 2);
    expect(result[1]).toBeCloseTo((0.4 + 0.8) / 2, 2);
    expect(result[2]).toBeCloseTo((0.8 + 0.6) / 2, 2);
  });
});

describe('mapMoodPoints', () => {
  it('normalizes payload data and sorts by date', () => {
    const rows = [
      { created_at: '2024-06-03T10:00:00.000Z', payload: { valence: 0.4, arousal: 0.5, labels: ['Calm'] } },
      { created_at: '2024-06-01T10:00:00.000Z', payload: { valence: -2, arousal: 2, labels: ['Bright'] } },
      { created_at: 'invalid', payload: { valence: 0.2 } },
    ];

    const result = mapMoodPoints(rows as any);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ date: '2024-06-01', valence: -1, arousal: 1, vibe: 'bright' });
    expect(result[1]).toMatchObject({ date: '2024-06-03', vibe: 'calm' });
  });
});

describe('aggregateWeeklySessions', () => {
  it('groups sessions per ISO week and sanitizes types', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-05-20T12:00:00.000Z'));
    const rows = [
      { created_at: '2024-05-06T09:00:00.000Z', type: 'FlashGlow' },
      { created_at: '2024-05-07T09:00:00.000Z', type: 'FlashGlow' },
      { created_at: '2024-05-08T09:00:00.000Z', type: 'Breath' },
      { created_at: '2024-05-15T09:00:00.000Z', type: 'VR' },
    ];

    const result = aggregateWeeklySessions(rows as any, 2);
    expect(result).toHaveLength(2);
    expect(result[0].week).toBe('2024-W19');
    expect(result[0]).toMatchObject({ flashglow: 2, breath: 1 });
    expect(result[1]).toMatchObject({ vr: 1 });
    vi.useRealTimers();
  });
});

describe('buildHeatmap', () => {
  it('selects dominant vibe for each day', () => {
    const rows = [
      { created_at: '2024-05-01T10:00:00.000Z', payload: { labels: ['Joyful'] } },
      { created_at: '2024-05-01T12:00:00.000Z', payload: { labels: ['Joy'] } },
      { created_at: '2024-05-02T12:00:00.000Z', payload: { labels: ['Focus'] } },
    ];

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-05-03T00:00:00.000Z'));

    const result = buildHeatmap(rows as any, 3);
    expect(result[0]).toMatchObject({
      date: '2024-05-01',
      vibe: 'bright',
      intensity: 'deep',
      meta: { count: 2, total: 2 },
    });
    expect(result[1]).toMatchObject({
      date: '2024-05-02',
      vibe: 'focus',
      intensity: 'deep',
      meta: { count: 1, total: 1 },
    });
    expect(result[2]).toMatchObject({
      date: '2024-05-03',
      vibe: undefined,
      intensity: undefined,
      meta: { count: 0, total: 0 },
    });
  });
});

describe('guards', () => {
  it('detects meaningful mood series', () => {
    expect(hasMeaningfulMood([{ date: '2024-05-01' }])).toBe(false);
    expect(hasMeaningfulMood([{ date: '2024-05-01', valence: 0.1 }])).toBe(true);
  });

  it('detects when any sessions are present', () => {
    expect(hasAnySessions([{ week: '2024-W01' }])).toBe(false);
    expect(hasAnySessions([{ week: '2024-W01', breath: 1 }])).toBe(true);
  });

  it('detects when any vibes are present', () => {
    expect(hasAnyVibes([{ date: '2024-05-01' }])).toBe(false);
    expect(hasAnyVibes([{ date: '2024-05-01', vibe: 'calm' }])).toBe(true);
  });
});

describe('computeSeriesSummary', () => {
  it('returns range and vibe distribution', () => {
    const result = computeSeriesSummary([
      { date: '2024-05-01', vibe: 'calm' },
      { date: '2024-05-02', vibe: 'calm' },
      { date: '2024-05-04', vibe: 'focus' },
    ]);

    expect(result.rangeDays).toBe(4);
    expect(result.vibeShare).toMatchObject({ calm: 2, focus: 1 });
  });
});

beforeEach(() => {
  vi.useRealTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

