import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JournalService } from '../journalService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Tests pour journalService
 * Day 39 - Module 21: Journal Service Layer
 * Target: 90% coverage
 */

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
  },
}));

describe('JournalService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createEntry', () => {
    it('crée une entrée texte avec succès', async () => {
      const mockEntry = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '660e8400-e29b-41d4-a716-446655440000',
        entry_type: 'text',
        title: 'Ma journée',
        text_content: 'Aujourd\'hui était une belle journée...',
        mood: 'good',
        emotions: ['joy', 'grateful'],
        tags: ['travail', 'famille'],
        is_private: true,
        is_favorite: false,
        word_count: 5,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockEntry, error: null }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await JournalService.createEntry(
        '660e8400-e29b-41d4-a716-446655440000',
        {
          entryType: 'text',
          title: 'Ma journée',
          textContent: 'Aujourd\'hui était une belle journée...',
          mood: 'good',
          emotions: ['joy', 'grateful'],
          tags: ['travail', 'famille'],
          isPrivate: true,
        }
      );

      expect(result).toMatchObject({
        id: '550e8400-e29b-41d4-a716-446655440000',
        entryType: 'text',
        title: 'Ma journée',
      });
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: '660e8400-e29b-41d4-a716-446655440000',
          entry_type: 'text',
          title: 'Ma journée',
        })
      );
    });

    it('calcule le nombre de mots correctement', async () => {
      const mockEntry = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '660e8400-e29b-41d4-a716-446655440000',
        entry_type: 'text',
        title: 'Test',
        text_content: 'Un deux trois quatre cinq six sept',
        word_count: 7,
        is_private: true,
        is_favorite: false,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockEntry, error: null }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      await JournalService.createEntry(
        '660e8400-e29b-41d4-a716-446655440000',
        {
          entryType: 'text',
          title: 'Test',
          textContent: 'Un deux trois quatre cinq six sept',
          isPrivate: true,
        }
      );

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          word_count: 7,
        })
      );
    });

    it('lance une erreur si la création échoue', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: new Error('Database error'),
            }),
          }),
        }),
      } as any);

      await expect(
        JournalService.createEntry('user-id', {
          entryType: 'text',
          title: 'Test',
          textContent: 'Test content',
          isPrivate: true,
        })
      ).rejects.toThrow();
    });
  });

  describe('updateEntry', () => {
    it('met à jour une entrée avec succès', async () => {
      const mockEntry = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '660e8400-e29b-41d4-a716-446655440000',
        entry_type: 'text',
        title: 'Titre modifié',
        text_content: 'Contenu modifié',
        mood: 'very_good',
        is_private: true,
        is_favorite: true,
        word_count: 2,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T11:00:00Z',
      };

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockEntry, error: null }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
      } as any);

      const result = await JournalService.updateEntry({
        entryId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Titre modifié',
        textContent: 'Contenu modifié',
        mood: 'very_good',
        isFavorite: true,
      });

      expect(result.title).toBe('Titre modifié');
      expect(result.isFavorite).toBe(true);
    });

    it('recalcule le nombre de mots lors de la mise à jour du texte', async () => {
      const mockEntry = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '660e8400-e29b-41d4-a716-446655440000',
        entry_type: 'text',
        title: 'Test',
        text_content: 'Nouveau contenu avec plusieurs mots',
        word_count: 5,
        is_private: true,
        is_favorite: false,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T11:00:00Z',
      };

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockEntry, error: null }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
      } as any);

      await JournalService.updateEntry({
        entryId: '550e8400-e29b-41d4-a716-446655440000',
        textContent: 'Nouveau contenu avec plusieurs mots',
      });

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          word_count: 5,
        })
      );
    });
  });

  describe('deleteEntry', () => {
    it('supprime une entrée avec succès', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as any);

      await JournalService.deleteEntry('550e8400-e29b-41d4-a716-446655440000');

      expect(mockDelete).toHaveBeenCalled();
    });

    it('lance une erreur si la suppression échoue', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: new Error('Delete failed'),
          }),
        }),
      } as any);

      await expect(
        JournalService.deleteEntry('550e8400-e29b-41d4-a716-446655440000')
      ).rejects.toThrow();
    });
  });

  describe('fetchEntry', () => {
    it('récupère une entrée spécifique', async () => {
      const mockEntry = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '660e8400-e29b-41d4-a716-446655440000',
        entry_type: 'text',
        title: 'Ma journée',
        text_content: 'Contenu...',
        is_private: true,
        is_favorite: false,
        word_count: 1,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockEntry, error: null }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await JournalService.fetchEntry('550e8400-e29b-41d4-a716-446655440000');

      expect(result.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(result.title).toBe('Ma journée');
    });
  });

  describe('fetchEntries', () => {
    it('récupère les entrées avec pagination', async () => {
      const mockEntries = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          user_id: '660e8400-e29b-41d4-a716-446655440000',
          entry_type: 'text',
          title: 'Entrée 1',
          is_private: true,
          is_favorite: false,
          word_count: 0,
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:00:00Z',
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          user_id: '660e8400-e29b-41d4-a716-446655440000',
          entry_type: 'voice',
          title: 'Entrée 2',
          is_private: true,
          is_favorite: false,
          word_count: 0,
          created_at: '2025-01-14T10:00:00Z',
          updated_at: '2025-01-14T10:00:00Z',
        },
      ];

      const mockRange = vi.fn().mockResolvedValue({
        data: mockEntries,
        error: null,
        count: 25,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              range: mockRange,
            }),
          }),
        }),
      } as any);

      const result = await JournalService.fetchEntries(
        '660e8400-e29b-41d4-a716-446655440000',
        undefined,
        { page: 1, pageSize: 20 }
      );

      expect(result.entries).toHaveLength(2);
      expect(result.total).toBe(25);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
    });

    it('applique les filtres correctement', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            contains: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: [],
                  error: null,
                  count: 0,
                }),
              }),
            }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      await JournalService.fetchEntries(
        'user-id',
        {
          entryType: 'text',
          mood: 'good',
          tags: ['travail'],
        },
        { page: 1, pageSize: 20 }
      );

      expect(mockSelect).toHaveBeenCalledWith('*', { count: 'exact' });
    });
  });

  describe('toggleFavorite', () => {
    it('active le favori si désactivé', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { is_favorite: false },
              error: null,
            }),
          }),
        }),
      } as any);

      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      } as any);

      const result = await JournalService.toggleFavorite('entry-id');

      expect(result).toBe(true);
    });

    it('désactive le favori si activé', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { is_favorite: true },
              error: null,
            }),
          }),
        }),
      } as any);

      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      } as any);

      const result = await JournalService.toggleFavorite('entry-id');

      expect(result).toBe(false);
    });
  });

  describe('addTags', () => {
    it('ajoute des tags à une entrée', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { tags: ['existant'] },
              error: null,
            }),
          }),
        }),
      } as any);

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      vi.mocked(supabase.from).mockReturnValueOnce({
        update: mockUpdate,
      } as any);

      await JournalService.addTags('entry-id', ['nouveau']);

      expect(mockUpdate).toHaveBeenCalledWith({
        tags: ['existant', 'nouveau'],
      });
    });

    it('évite les doublons de tags', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { tags: ['tag1', 'tag2'] },
              error: null,
            }),
          }),
        }),
      } as any);

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      vi.mocked(supabase.from).mockReturnValueOnce({
        update: mockUpdate,
      } as any);

      await JournalService.addTags('entry-id', ['tag1', 'tag3']);

      expect(mockUpdate).toHaveBeenCalledWith({
        tags: ['tag1', 'tag2', 'tag3'],
      });
    });
  });

  describe('removeTags', () => {
    it('supprime des tags d\'une entrée', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { tags: ['tag1', 'tag2', 'tag3'] },
              error: null,
            }),
          }),
        }),
      } as any);

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      vi.mocked(supabase.from).mockReturnValueOnce({
        update: mockUpdate,
      } as any);

      await JournalService.removeTags('entry-id', ['tag2']);

      expect(mockUpdate).toHaveBeenCalledWith({
        tags: ['tag1', 'tag3'],
      });
    });
  });

  describe('fetchPopularTags', () => {
    it('retourne les tags les plus utilisés', async () => {
      const mockEntries = [
        { tags: ['tag1', 'tag2'] },
        { tags: ['tag1', 'tag3'] },
        { tags: ['tag1', 'tag2', 'tag3'] },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: mockEntries,
            error: null,
          }),
        }),
      } as any);

      const result = await JournalService.fetchPopularTags('user-id', 3);

      expect(result).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('limite le nombre de tags retournés', async () => {
      const mockEntries = [
        { tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'] },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: mockEntries,
            error: null,
          }),
        }),
      } as any);

      const result = await JournalService.fetchPopularTags('user-id', 2);

      expect(result.length).toBeLessThanOrEqual(2);
    });
  });

  describe('calculateStreak', () => {
    it('calcule correctement le streak actuel', () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

      const entries = [
        { created_at: today },
        { created_at: yesterday },
        { created_at: twoDaysAgo },
      ];

      const result = JournalService.calculateStreak(entries);

      expect(result.currentStreak).toBe(3);
    });

    it('retourne 0 si aucune entrée récente', () => {
      const threeDaysAgo = new Date(Date.now() - 259200000).toISOString();

      const entries = [
        { created_at: threeDaysAgo },
      ];

      const result = JournalService.calculateStreak(entries);

      expect(result.currentStreak).toBe(0);
    });

    it('calcule le streak le plus long', () => {
      const entries = [
        { created_at: '2025-01-15' },
        { created_at: '2025-01-14' },
        { created_at: '2025-01-13' },
        { created_at: '2025-01-10' }, // Gap
        { created_at: '2025-01-09' },
        { created_at: '2025-01-08' },
        { created_at: '2025-01-07' },
        { created_at: '2025-01-06' },
      ];

      const result = JournalService.calculateStreak(entries);

      expect(result.longestStreak).toBeGreaterThanOrEqual(4);
    });
  });

  describe('searchEntries', () => {
    it('recherche dans le titre et le contenu', async () => {
      const mockEntries = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          user_id: 'user-id',
          entry_type: 'text',
          title: 'Journée de travail',
          text_content: 'Projet important',
          is_private: true,
          is_favorite: false,
          word_count: 2,
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:00:00Z',
        },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            or: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: mockEntries,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      } as any);

      const result = await JournalService.searchEntries('user-id', 'travail');

      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('travail');
    });
  });
});
