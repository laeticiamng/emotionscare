import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getEvents: vi.fn(),
  computeSnapshot: vi.fn(),
}));

vi.mock('@/lib/scores/events', () => ({
  getEvents: mocks.getEvents,
}));

vi.mock('@/lib/scores/compute', () => ({
  computeSnapshot: mocks.computeSnapshot,
}));

import { getCoachContext, loadEmotionScanHistory01 } from '@/lib/coach/context';

describe('emotion scan mappers', () => {
  beforeEach(() => {
    mocks.getEvents.mockReset();
    mocks.computeSnapshot.mockReset();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('normalizes stored scan history between 0 and 1', () => {
    localStorage.setItem('emotion_scan_history_v1', JSON.stringify([0, 50, 120]));

    expect(loadEmotionScanHistory01()).toEqual([0, 0.5, 1]);
  });

  it('returns an empty array when history is missing or malformed', () => {
    expect(loadEmotionScanHistory01()).toEqual([]);

    localStorage.setItem('emotion_scan_history_v1', 'not-an-array');
    expect(loadEmotionScanHistory01()).toEqual([]);
  });

  it('builds the coach context from stored events and history', () => {
    vi.useFakeTimers();
    const now = new Date('2024-03-12T09:15:00Z');
    vi.setSystemTime(now);

    localStorage.setItem('emotion_scan_history_v1', JSON.stringify([40, 85]));

    mocks.getEvents.mockReturnValue([
      { module: 'mood-mixer', startedAt: '2024-03-09T12:00:00Z' },
      { module: 'emotion-scan', startedAt: '2024-03-10T12:00:00Z' },
      { module: 'journal', startedAt: '2024-03-11T12:00:00Z' },
      { module: 'coach', startedAt: '2024-03-12T12:00:00Z' },
    ]);

    mocks.computeSnapshot.mockReturnValue({
      total: 179.6,
      streakDays: 4,
      level: 3,
    });

    const context = getCoachContext();

    expect(context.nowHour).toBe(now.getHours());
    expect(context.streakDays).toBe(4);
    expect(context.totalPoints).toBe(180);
    expect(context.lastScanBalance01).toBeCloseTo(0.85, 2);
    expect(context.recentModules).toEqual(['coach', 'journal', 'emotion-scan']);
  });
});
