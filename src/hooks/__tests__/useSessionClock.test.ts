// @ts-nocheck
import { act, renderHook } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { useSessionClock } from '../useSessionClock';

describe('useSessionClock', () => {
  let now = 0;
  let nowSpy: ReturnType<typeof vi.spyOn>;

  const advance = (ms: number) => {
    act(() => {
      now += ms;
      vi.advanceTimersByTime(ms);
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
    now = 0;
    nowSpy = vi.spyOn(performance, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    nowSpy.mockRestore();
    vi.useRealTimers();
  });

  it('progresses the elapsed time without accumulating drift', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 5000, tickMs: 1000 }));

    act(() => result.current.start());

    for (let index = 0; index < 5; index += 1) {
      advance(1000);
    }

    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(5000);
    expect(result.current.state).toBe('completed');
    expect(result.current.progress).toBeCloseTo(1, 2);
  });

  it('supports pause, resume and manual completion', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 20000, tickMs: 1000 }));

    act(() => result.current.start());
    advance(1500);

    const pausedAt = result.current.elapsedMs;
    act(() => result.current.pause());
    advance(4000);

    expect(result.current.elapsedMs).toBe(pausedAt);
    expect(result.current.state).toBe('paused');

    act(() => result.current.resume());
    advance(1000);

    expect(result.current.elapsedMs).toBeGreaterThan(pausedAt);
    expect(result.current.state).toBe('running');

    act(() => result.current.complete());

    expect(result.current.state).toBe('completed');
    expect(result.current.remainingMs).toBeGreaterThanOrEqual(0);
  });
});

