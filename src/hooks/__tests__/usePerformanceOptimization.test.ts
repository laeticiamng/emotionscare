/**
 * Tests pour usePerformanceOptimization
 * Couvre : mesure de rendu, debounce, memoize, metrics
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import { usePerformanceOptimization, useConditionalLazyLoad } from '@/hooks/usePerformanceOptimization';

describe('usePerformanceOptimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retourne les fonctions utilitaires', () => {
    const { result } = renderHook(() => usePerformanceOptimization('TestComponent'));

    expect(result.current.measureRender).toBeDefined();
    expect(result.current.debounce).toBeDefined();
    expect(result.current.memoize).toBeDefined();
    expect(result.current.metrics).toBeDefined();
  });

  it('mesure le temps de rendu via measureRender', () => {
    const { result } = renderHook(() => usePerformanceOptimization('TestComponent'));

    act(() => {
      result.current.measureRender();
    });

    // metrics est un ref snapshot, vérifier que la fonction ne throw pas
    expect(result.current.metrics).toBeDefined();
    expect(typeof result.current.metrics.renderTime).toBe('number');
  });

  it('debounce retarde l\'exécution', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePerformanceOptimization('TestComponent'));

    const mockFn = vi.fn();
    const debouncedFn = result.current.debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('memoize cache les résultats', () => {
    const { result } = renderHook(() => usePerformanceOptimization('TestComponent'));

    const expensiveFn = vi.fn((x: number) => x * 2);
    const memoizedFn = result.current.memoize(expensiveFn);

    const result1 = memoizedFn(5);
    const result2 = memoizedFn(5);

    expect(result1).toBe(10);
    expect(result2).toBe(10);
    expect(expensiveFn).toHaveBeenCalledTimes(1);
  });
});

describe('useConditionalLazyLoad', () => {
  it('ne charge pas si shouldLoad est false', () => {
    const importFn = vi.fn();
    const { result } = renderHook(() => useConditionalLazyLoad(false, importFn));

    expect(result.current.component).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(importFn).not.toHaveBeenCalled();
  });

  it('charge le composant si shouldLoad est true', async () => {
    const MockComponent = () => null;
    const importFn = vi.fn().mockResolvedValue({ default: MockComponent });

    const { result, rerender } = renderHook(
      ({ shouldLoad }) => useConditionalLazyLoad(shouldLoad, importFn),
      { initialProps: { shouldLoad: true } }
    );

    // Wait for the async load
    await vi.waitFor(() => {
      expect(result.current.component).not.toBeNull();
    });

    expect(importFn).toHaveBeenCalledTimes(1);
  });
});
