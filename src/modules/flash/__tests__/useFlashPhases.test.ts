import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFlashPhases } from '../useFlashPhases';

describe('useFlashPhases', () => {
  it('returns the correct phase snapshot for the elapsed time', () => {
    const { result } = renderHook(() => useFlashPhases());

    act(() => {
      result.current.update(0);
    });

    expect(result.current.snapshot.phase.key).toBe('warmup');
    expect(result.current.snapshot.nextPhase?.key).toBe('glow');

    act(() => {
      result.current.update(45_000);
    });

    expect(result.current.snapshot.phase.key).toBe('glow');
    expect(result.current.snapshot.index).toBe(1);
    expect(result.current.snapshot.progress).toBeGreaterThan(0);

    act(() => {
      result.current.update(115_000);
    });

    expect(result.current.snapshot.phase.key).toBe('settle');
    expect(result.current.snapshot.nextPhase).toBeNull();
    expect(result.current.snapshot.remainingInPhase).toBeLessThanOrEqual(30_000);
  });

  it('invokes the onPhaseChange callback when entering a new phase', () => {
    const onPhaseChange = vi.fn();
    const { result } = renderHook(() => useFlashPhases(undefined, { onPhaseChange }));

    act(() => {
      result.current.update(10_000);
    });

    act(() => {
      result.current.update(35_000);
    });

    act(() => {
      result.current.update(95_000);
    });

    expect(onPhaseChange).toHaveBeenCalledWith('glow');
    expect(onPhaseChange).toHaveBeenCalledWith('settle');
    expect(onPhaseChange).toHaveBeenCalledTimes(2);
  });
});

