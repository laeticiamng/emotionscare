import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBreathPattern } from '../useBreathPattern';

const rafDriver = vi.hoisted(() => ({
  callback: null as null | ((t: number) => void),
}));

vi.mock('@/ui/hooks/useRaf', () => ({
  useRaf: (cb: (t: number) => void, enabled = true) => {
    if (enabled) {
      rafDriver.callback = cb;
    } else if (rafDriver.callback === cb) {
      rafDriver.callback = null;
    }
  },
}));

const SIMPLE_PATTERN: Array<{ phase: 'inhale' | 'exhale'; sec: number }> = [
  { phase: 'inhale', sec: 1 },
  { phase: 'exhale', sec: 1 },
];

describe('useBreathPattern', () => {
  let now = 0;
  let performanceSpy: ReturnType<typeof vi.spyOn>;

  const advance = (ms: number) => {
    now += ms;
    const callback = rafDriver.callback;
    if (callback) {
      act(() => {
        callback(now);
      });
    }
  };

  beforeEach(() => {
    now = 0;
    performanceSpy = vi.spyOn(performance, 'now').mockImplementation(() => now);
    rafDriver.callback = null;
  });

  it('gère la progression des phases et cycles', () => {
    const { result } = renderHook(() => useBreathPattern(SIMPLE_PATTERN, 2));

    expect(result.current.running).toBe(false);
    expect(result.current.current.phase).toBe('inhale');

    act(() => {
      result.current.start();
    });

    expect(result.current.running).toBe(true);
    expect(rafDriver.callback).toBeTypeOf('function');

    advance(500);
    expect(result.current.phaseProgress).toBeCloseTo(0.5, 1);
    expect(result.current.current.phase).toBe('inhale');

    advance(600);
    expect(result.current.current.phase).toBe('exhale');
    expect(result.current.cycle).toBe(0);

    advance(1000);
    expect(result.current.current.phase).toBe('inhale');
    expect(result.current.cycle).toBe(1);

    act(() => {
      result.current.stop();
    });

    expect(result.current.running).toBe(false);
    expect(result.current.cycle).toBe(0);
    expect(result.current.phaseProgress).toBe(0);
    expect(result.current.current.phase).toBe('inhale');
  });

  afterEach(() => {
    performanceSpy.mockRestore();
    rafDriver.callback = null;
  });
});

