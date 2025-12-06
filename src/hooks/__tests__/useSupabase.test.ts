import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSupabase } from '../useSupabase';
import { globalErrorService } from '@/lib/errorBoundary';

vi.mock('@/lib/errorBoundary', () => ({
  globalErrorService: {
    reportError: vi.fn(),
  },
}));

describe('useSupabase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle supabase errors', () => {
    const { result } = renderHook(() => useSupabase());
    const error = { message: 'Database error' };

    act(() => {
      result.current.handleSupabaseError(error, 'test context');
    });

    expect(globalErrorService.reportError).toHaveBeenCalledWith(
      expect.any(Error),
      'Supabase: test context'
    );
  });

  it('should return data on successful query', async () => {
    const { result } = renderHook(() => useSupabase());
    const mockData = { id: '1', name: 'Test' };
    const mockQueryFn = vi.fn().mockResolvedValue({ data: mockData, error: null });

    const data = await act(async () => {
      return await result.current.safeQuery(mockQueryFn, 'test query');
    });

    expect(data).toEqual(mockData);
    expect(globalErrorService.reportError).not.toHaveBeenCalled();
  });

  it('should return null and report error on failed query', async () => {
    const { result } = renderHook(() => useSupabase());
    const mockError = { message: 'Query failed' };
    const mockQueryFn = vi.fn().mockResolvedValue({ data: null, error: mockError });

    const data = await act(async () => {
      return await result.current.safeQuery(mockQueryFn, 'failed query');
    });

    expect(data).toBeNull();
    expect(globalErrorService.reportError).toHaveBeenCalled();
  });
});
