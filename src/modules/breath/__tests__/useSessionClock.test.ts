/**
 * Tests for useSessionClock hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionClock } from '../useSessionClock';

describe('useSessionClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with idle state', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 60000 }));
    
    expect(result.current.state).toBe('idle');
    expect(result.current.elapsedMs).toBe(0);
    expect(result.current.progress).toBe(0);
  });

  it('starts counting when started', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 60000 }));
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.state).toBe('running');
    
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    expect(result.current.elapsedMs).toBeGreaterThan(0);
  });

  it('pauses and resumes correctly', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 60000 }));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    act(() => {
      result.current.pause();
    });
    
    expect(result.current.state).toBe('paused');
    const elapsedWhenPaused = result.current.elapsedMs;
    
    // Time should not advance while paused
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(result.current.elapsedMs).toBe(elapsedWhenPaused);
    
    act(() => {
      result.current.resume();
    });
    
    expect(result.current.state).toBe('running');
  });

  it('resets to initial state', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 60000 }));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.state).toBe('idle');
    expect(result.current.elapsedMs).toBe(0);
    expect(result.current.progress).toBe(0);
  });

  it('completes when time runs out', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 5000 }));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    
    expect(result.current.state).toBe('completed');
  });

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 10000 }));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      result.current.complete();
    });
    
    expect(result.current.progress).toBe(1);
    expect(result.current.elapsedMs).toBe(10000);
  });
});
