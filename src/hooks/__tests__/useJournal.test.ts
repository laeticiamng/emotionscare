/**
 * Tests unitaires pour useJournal
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock Supabase
const mockInvoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

// Mock store
const mockStore = {
  setUploading: vi.fn(),
  setCurrentEntry: vi.fn(),
  addEntry: vi.fn(),
};
vi.mock('@/store/journal.store', () => ({
  useJournalStore: () => mockStore,
  JournalEntry: {},
}));

// Import après les mocks
import { useJournal } from '../useJournal';

// Wrapper pour React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
};

describe('useJournal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInvoke.mockResolvedValue({
      data: {
        entries: [
          {
            id: '1',
            created_at: '2026-02-01T10:00:00Z',
            content: 'Test entry',
            mood_bucket: 'positif',
          },
        ],
      },
      error: null,
    });
  });

  describe('Initialisation', () => {
    it('retourne les entrées du journal', async () => {
      const { result } = renderHook(() => useJournal(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entries).toBeDefined();
      expect(Array.isArray(result.current.entries)).toBe(true);
    });

    it('expose les fonctions de soumission', () => {
      const { result } = renderHook(() => useJournal(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.submitVoice).toBe('function');
      expect(typeof result.current.submitText).toBe('function');
    });

    it('gère l\'état de chargement', async () => {
      const { result } = renderHook(() => useJournal(), {
        wrapper: createWrapper(),
      });

      // Au début, loading peut être true
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Fetch des entrées', () => {
    it('appelle journal-weekly au chargement', async () => {
      renderHook(() => useJournal(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockInvoke).toHaveBeenCalledWith('journal-weekly', {
          body: {},
        });
      });
    });

    it('gère les erreurs de fetch', async () => {
      mockInvoke.mockResolvedValueOnce({
        data: null,
        error: new Error('Network error'),
      });

      const { result } = renderHook(() => useJournal(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });

    it('retourne un tableau vide si pas d\'entrées', async () => {
      mockInvoke.mockResolvedValueOnce({
        data: { entries: [] },
        error: null,
      });

      const { result } = renderHook(() => useJournal(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.entries).toEqual([]);
      });
    });
  });

  describe('Structure des entrées', () => {
    it('les entrées ont les champs requis', async () => {
      mockInvoke.mockResolvedValueOnce({
        data: {
          entries: [
            {
              id: 'test-1',
              created_at: '2026-02-01T10:00:00Z',
              content: 'Mon journal',
              mood_bucket: 'calme',
              summary: 'Résumé test',
            },
          ],
        },
        error: null,
      });

      const { result } = renderHook(() => useJournal(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.entries.length).toBe(1);
        expect(result.current.entries[0]).toHaveProperty('id');
        expect(result.current.entries[0]).toHaveProperty('content');
        expect(result.current.entries[0]).toHaveProperty('mood_bucket');
      });
    });
  });
});
