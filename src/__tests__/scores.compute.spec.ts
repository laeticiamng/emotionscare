import { afterEach, describe, expect, it, vi } from 'vitest';
import { bucketByDay, computeBadges, computeLevel, computeSnapshot, computeStreakDays } from '@/lib/scores/compute';
import type { SessionEvent } from '@/SCHEMA';

describe('scores compute selectors', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('groups events by day and sums durations and scores', () => {
    const events: SessionEvent[] = [
      { startedAt: '2024-03-10T10:00:00Z', durationSec: 600 },
      { startedAt: '2024-03-10T18:15:00Z', score: 5 },
      { startedAt: '2024-03-09T09:00:00Z', durationSec: 120 },
    ];

    const buckets = bucketByDay(events);

    expect(buckets).toHaveLength(2);
    expect(buckets[0].date).toBe('2024-03-09');
    expect(buckets[0].value).toBeCloseTo(2); // 120s -> 2 minutes
    expect(buckets[1].date).toBe('2024-03-10');
    expect(buckets[1].value).toBeCloseTo(15); // 10 minutes + score 5
  });

  it('counts only consecutive days ending today for streaks', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-12T12:00:00Z'));

    const events: SessionEvent[] = [
      { startedAt: '2024-03-12T09:00:00Z', score: 2 },
      { startedAt: '2024-03-11T09:00:00Z', score: 3 },
      { startedAt: '2024-03-09T09:00:00Z', score: 4 },
    ];

    expect(computeStreakDays(events)).toBe(2);
  });

  it('increases the level as total points grow', () => {
    expect(computeLevel(0)).toBe(1);
    expect(computeLevel(10)).toBeGreaterThanOrEqual(1);
    expect(computeLevel(200)).toBeGreaterThan(computeLevel(10));
  });

  it('awards milestone badges based on streaks and totals', () => {
    expect(computeBadges(0, 0)).toEqual([]);
    expect(computeBadges(7, 120)).toEqual([
      'first-session',
      'streak-3',
      'streak-7',
      'centurion',
    ]);
  });

  it('produces a consistent snapshot aggregation', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-12T12:00:00Z'));

    const events: SessionEvent[] = [
      { startedAt: '2024-03-12T10:00:00Z', score: 6 },
      { startedAt: '2024-03-11T10:00:00Z', durationSec: 300 },
      { startedAt: '2024-03-10T10:00:00Z', durationSec: 600 },
    ];

    const snapshot = computeSnapshot(events);

    expect(snapshot.total).toBeCloseTo(21); // 6 + 5 + 10 minutes
    expect(snapshot.streakDays).toBe(3);
    expect(snapshot.badges).toEqual(['first-session', 'streak-3']);
    expect(snapshot.byDay?.map(d => d.date)).toEqual([
      '2024-03-10',
      '2024-03-11',
      '2024-03-12',
    ]);
  });
});
