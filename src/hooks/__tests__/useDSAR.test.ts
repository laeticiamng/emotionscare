// @ts-nocheck
/**
 * Tests pour useDSAR (RGPD - Data Subject Access Request)
 * Couvre : fetch requests, create request, generate package
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock supabase
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockInvoke = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (table: string) => ({
      select: (...args: unknown[]) => {
        mockSelect(table, ...args);
        return {
          order: () => Promise.resolve({ data: [], error: null }),
        };
      },
      insert: (data: unknown) => {
        mockInsert(table, data);
        return {
          select: () => ({
            single: () => Promise.resolve({
              data: { id: 'req-1', ...data as Record<string, unknown> },
              error: null,
            }),
          }),
        };
      },
    }),
    auth: {
      getUser: () => Promise.resolve({
        data: { user: { id: 'user-1' } },
      }),
    },
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { useDSAR } from '@/hooks/useDSAR';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useDSAR', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initialise avec une liste vide', async () => {
    const { result } = renderHook(() => useDSAR(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.requests).toEqual([]);
  });

  it('expose les méthodes createRequest et generatePackage', async () => {
    const { result } = renderHook(() => useDSAR(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(typeof result.current.createRequest).toBe('function');
    expect(typeof result.current.generatePackage).toBe('function');
  });

  it('createRequest insert dans la table dsar_requests', async () => {
    const { result } = renderHook(() => useDSAR(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await result.current.createRequest({ type: 'export', details: 'Full export' });

    expect(mockInsert).toHaveBeenCalledWith(
      'dsar_requests',
      expect.objectContaining({ type: 'export', details: 'Full export', user_id: 'user-1' })
    );
  });

  it('generatePackage appelle la edge function dsar-handler', async () => {
    mockInvoke.mockResolvedValue({ data: { url: 'https://download.test' }, error: null });

    const { result } = renderHook(() => useDSAR(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await result.current.generatePackage('req-123');

    expect(mockInvoke).toHaveBeenCalledWith(
      'dsar-handler/generate-package',
      { body: { requestId: 'req-123' } }
    );
  });
});
