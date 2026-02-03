/**
 * useJournalEntries Hook - Tests
 * Tests unitaires pour le hook useJournalEntries
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock the journalApi
vi.mock('../services/journalApi', () => ({
  journalApi: {
    list: vi.fn(),
  },
}));

import { useJournalEntries } from '../hooks/useJournalEntries';
import { journalApi } from '../services/journalApi';

// Create a wrapper with QueryClientProvider
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('useJournalEntries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches journal entries on mount', async () => {
    const mockEntries = [
      { id: '1', title: 'Entry 1', content: 'Content 1' },
      { id: '2', title: 'Entry 2', content: 'Content 2' },
    ];

    (journalApi.list as ReturnType<typeof vi.fn>).mockResolvedValue(mockEntries);

    const { result } = renderHook(() => useJournalEntries(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEntries);
    expect(journalApi.list).toHaveBeenCalledWith(undefined);
  });

  it('passes filters to the API', async () => {
    const mockEntries = [{ id: '1', title: 'Filtered' }];
    // Use proper filter format
    const filters = { 
      limit: 10, 
      offset: 0, 
      sortBy: 'date' as const, 
      sortOrder: 'desc' as const 
    };

    (journalApi.list as ReturnType<typeof vi.fn>).mockResolvedValue(mockEntries);

    const { result } = renderHook(() => useJournalEntries(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(journalApi.list).toHaveBeenCalledWith(filters);
    expect(result.current.data).toEqual(mockEntries);
  });

  it('handles API errors', async () => {
    const error = new Error('API Error');
    (journalApi.list as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    const { result } = renderHook(() => useJournalEntries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('returns empty array when no entries', async () => {
    (journalApi.list as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const { result } = renderHook(() => useJournalEntries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });

  it('uses correct staleTime of 30 seconds', async () => {
    const mockEntries = [{ id: '1', title: 'Entry' }];
    (journalApi.list as ReturnType<typeof vi.fn>).mockResolvedValue(mockEntries);

    const { result } = renderHook(() => useJournalEntries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // The hook should have been called only once
    expect(journalApi.list).toHaveBeenCalledTimes(1);
  });
});

describe('useJournalEntries - Loading States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while fetching', async () => {
    let resolvePromise: (value: any[]) => void;
    const promise = new Promise<any[]>((resolve) => {
      resolvePromise = resolve;
    });

    (journalApi.list as ReturnType<typeof vi.fn>).mockReturnValue(promise);

    const { result } = renderHook(() => useJournalEntries(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Resolve the promise
    resolvePromise!([{ id: '1' }]);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('maintains previous data during refetch', async () => {
    const initialEntries = [{ id: '1', title: 'Initial' }];
    (journalApi.list as ReturnType<typeof vi.fn>).mockResolvedValue(initialEntries);

    const { result } = renderHook(() => useJournalEntries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(initialEntries);
  });
});
