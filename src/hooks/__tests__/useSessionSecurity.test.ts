/**
 * Tests pour useSessionSecurity
 * Couvre : timer reset, warning display, session expiration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { useSessionSecurity } from '@/hooks/use-session-security';

describe('useSessionSecurity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initialise avec les valeurs par défaut', () => {
    const { result } = renderHook(() => useSessionSecurity());
    expect(result.current.showWarning).toBe(false);
    expect(result.current.timeLeft).toBe(30 * 60); // 30 min default
  });

  it('accepte des options personnalisées', () => {
    const { result } = renderHook(() =>
      useSessionSecurity({ sessionDuration: 600, warningTimeBeforeExpire: 30 })
    );
    expect(result.current.timeLeft).toBe(600);
  });

  it('resetTimer remet le timer', () => {
    const { result } = renderHook(() =>
      useSessionSecurity({ sessionDuration: 120, warningTimeBeforeExpire: 30 })
    );

    // Advance time
    act(() => {
      vi.advanceTimersByTime(50_000);
    });

    expect(result.current.timeLeft).toBeLessThan(120);

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.timeLeft).toBe(120);
    expect(result.current.showWarning).toBe(false);
  });

  it('affiche le warning quand le temps restant <= warningTime', () => {
    const { result } = renderHook(() =>
      useSessionSecurity({ sessionDuration: 10, warningTimeBeforeExpire: 5 })
    );

    // Advance past warning threshold (10 - 5 = 5 seconds idle)
    act(() => {
      vi.advanceTimersByTime(6_000);
    });

    expect(result.current.showWarning).toBe(true);
  });

  it('timeLeft ne descend pas en dessous de 0', () => {
    const { result } = renderHook(() =>
      useSessionSecurity({ sessionDuration: 3, warningTimeBeforeExpire: 1 })
    );

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.timeLeft).toBe(0);
  });
});
