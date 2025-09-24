import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useSessionClock } from '../useSessionClock';

describe('useSessionClock', () => {
  let perfNowSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    vi.useFakeTimers();
    perfNowSpy = vi.spyOn(performance, 'now').mockImplementation(() => Date.now());
  });

  afterEach(() => {
    vi.useRealTimers();
    perfNowSpy?.mockRestore();
    perfNowSpy = null;
  });

  it('completes automatically when reaching duration', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 1_000, tickMs: 100 }));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(1_200);
    });

    expect(result.current.state).toBe('completed');
    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(1_000);
    expect(result.current.progress).toBeGreaterThanOrEqual(1);
  });

  it('pauses and resumes while preserving state', async () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 2_000, tickMs: 100 }));

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(600);
      result.current.pause();
    });

    const elapsedAfterPause = result.current.elapsedMs;

    act(() => {
      result.current.resume();
      vi.advanceTimersByTime(600);
    });

    expect(result.current.elapsedMs).toBeGreaterThan(elapsedAfterPause);
  });

  it('invokes onTick subscribers', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 1_000, tickMs: 100 }));
    const handler = vi.fn();

    act(() => {
      result.current.onTick(handler);
      result.current.start();
      vi.advanceTimersByTime(500);
    });

    expect(handler).toHaveBeenCalled();
  });
});
