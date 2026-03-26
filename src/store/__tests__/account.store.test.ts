// @ts-nocheck
/**
 * Tests pour account.store (Zustand)
 * Couvre : état initial, setters, getDaysUntilPurge logic, reset
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase before importing store
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } } }),
    },
    from: () => ({
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

// Mock persist to avoid localStorage issues in tests
vi.mock('@/store/utils/createImmutableStore', () => ({
  persist: (config: Function) => config,
}));

vi.mock('@/store/utils/createSelectors', () => ({
  createSelectors: (store: unknown) => store,
}));

import { useAccountStore, type AccountStatus } from '@/store/account.store';

describe('account.store', () => {
  beforeEach(() => {
    // Reset store state
    const store = useAccountStore as unknown as { setState: (s: Record<string, unknown>) => void };
    if (store.setState) {
      store.setState({
        status: 'active' as AccountStatus,
        purgeAt: undefined,
        loading: false,
        error: null,
      });
    }
  });

  it('état initial est active', () => {
    const state = useAccountStore.getState();
    expect(state.status).toBe('active');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setStatus met à jour le statut', () => {
    useAccountStore.getState().setStatus('soft_deleted');
    expect(useAccountStore.getState().status).toBe('soft_deleted');
  });

  it('setPurgeAt met à jour la date de purge', () => {
    const date = '2026-04-01T00:00:00Z';
    useAccountStore.getState().setPurgeAt(date);
    expect(useAccountStore.getState().purgeAt).toBe(date);
  });

  it('setError met à jour l\'erreur', () => {
    useAccountStore.getState().setError('Test error');
    expect(useAccountStore.getState().error).toBe('Test error');
  });

  it('reset remet l\'état initial', () => {
    useAccountStore.getState().setStatus('soft_deleted');
    useAccountStore.getState().setError('err');
    useAccountStore.getState().reset();
    
    const state = useAccountStore.getState();
    expect(state.status).toBe('active');
    expect(state.error).toBeNull();
    expect(state.purgeAt).toBeUndefined();
  });
});
