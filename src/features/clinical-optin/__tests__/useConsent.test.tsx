import React from 'react';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { supabase } from '@/integrations/supabase/client';
import { ConsentProvider, useConsent } from '../ConsentProvider';

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  setTag: vi.fn(),
}));

const toastSpy = vi.fn();

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastSpy }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string>) => options?.defaultValue ?? key,
  }),
}));

const originalFrom = supabase.from;
const fetchMock = vi.fn();

global.fetch = fetchMock as unknown as typeof fetch;

type MaybeResult = { data: any; error: any };

const createSelectBuilder = (queue: MaybeResult[]) => {
  const builder: any = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    is: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    maybeSingle: vi.fn(() => Promise.resolve(queue.shift() ?? { data: null, error: null })),
    then: (onFulfilled: any, onRejected?: any) => Promise.resolve({ data: [], error: null }).then(onFulfilled, onRejected),
    catch: (onRejected: any) => Promise.resolve({ data: [], error: null }).catch(onRejected),
    finally: (onFinally: any) => Promise.resolve({ data: [], error: null }).finally(onFinally),
  };

  return builder;
};

const createWrapper = (responses: MaybeResult[]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const queue = [...responses];

  supabase.from = vi.fn(() => createSelectBuilder(queue)) as typeof supabase.from;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ConsentProvider>{children}</ConsentProvider>
    </QueryClientProvider>
  );

  const cleanup = () => {
    supabase.from = originalFrom;
    if (typeof (queryClient as any).clear === 'function') {
      (queryClient as any).clear();
    } else {
      queryClient.removeQueries();
      queryClient.getMutationCache().clear();
    }
  };

  return { wrapper, cleanup, queryClient };
};

afterEach(() => {
  fetchMock.mockReset();
  toastSpy.mockReset();
  supabase.from = originalFrom;
});

describe('useConsent', () => {
  it('moves from none to accepted when accept() succeeds', async () => {
    const { wrapper, cleanup } = createWrapper([
      { data: null, error: null },
      { data: null, error: null },
      { data: { scope: 'clinical', revoked_at: null }, error: null },
    ]);

    fetchMock.mockResolvedValue({ ok: true, status: 200, json: vi.fn() });

    const { result, unmount } = renderHook(() => useConsent(), { wrapper });

    try {
      await waitFor(() => expect(result.current.status).toBe('none'));

      await act(async () => {
        await result.current.accept();
      });

      await waitFor(() => expect(result.current.status).toBe('accepted'));
      expect(fetchMock).toHaveBeenCalledWith('/functions/v1/optin-accept', expect.objectContaining({ method: 'POST' }));
    } finally {
      unmount();
      cleanup();
    }
  });

  it('marks consent as revoked after revoke()', async () => {
    const { wrapper, cleanup } = createWrapper([
      { data: { scope: 'clinical', revoked_at: null }, error: null },
      { data: null, error: null },
      { data: { scope: 'clinical', revoked_at: '2024-01-01' }, error: null },
    ]);

    fetchMock.mockResolvedValue({ ok: true, status: 200, json: vi.fn() });

    const { result, unmount } = renderHook(() => useConsent(), { wrapper });

    try {
      await waitFor(() => expect(result.current.status).toBe('accepted'));

      await act(async () => {
        await result.current.revoke();
      });

      await waitFor(() => {
        expect(result.current.status).toBe('none');
        expect(result.current.wasRevoked).toBe(true);
      });

      expect(fetchMock).toHaveBeenCalledWith('/functions/v1/optin-revoke', expect.objectContaining({ method: 'POST' }));
    } finally {
      unmount();
      cleanup();
    }
  });

  it('surfaces errors from the consent query', async () => {
    const error = new Error('network');
    const { wrapper, cleanup } = createWrapper([
      { data: null, error },
    ]);

    const { result, unmount } = renderHook(() => useConsent(), { wrapper });

    try {
      await waitFor(() => expect(result.current.status).toBe('none'));
      await waitFor(() => expect(toastSpy).toHaveBeenCalled());
    } finally {
      unmount();
      cleanup();
    }
  });
});

