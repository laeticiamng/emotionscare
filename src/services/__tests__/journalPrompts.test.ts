// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { journalPromptsService } from '@/services/journalPrompts';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

describe('journalPromptsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRandomPrompt', () => {
    it('récupère un prompt aléatoire sans catégorie', async () => {
      const mockPrompts = [
        { id: '1', category: 'reflection', prompt_text: 'Test prompt 1', difficulty_level: 1 },
        { id: '2', category: 'gratitude', prompt_text: 'Test prompt 2', difficulty_level: 2 },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };
      mockQuery.eq.mockResolvedValue({ data: mockPrompts, error: null });
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await journalPromptsService.getRandomPrompt();

      expect(supabase.from).toHaveBeenCalledWith('journal_prompts');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('is_active', true);
      expect(result).toBeDefined();
      expect(mockPrompts).toContainEqual(result);
    });

    it('filtre par catégorie quand spécifié', async () => {
      const mockPrompts = [
        { id: '1', category: 'gratitude', prompt_text: 'Test prompt', difficulty_level: 1 },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };
      mockQuery.eq.mockResolvedValueOnce(mockQuery).mockResolvedValueOnce({ data: mockPrompts, error: null });
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await journalPromptsService.getRandomPrompt('gratitude');

      expect(mockQuery.eq).toHaveBeenCalledWith('is_active', true);
      expect(mockQuery.eq).toHaveBeenCalledWith('category', 'gratitude');
      expect(result).toEqual(mockPrompts[0]);
    });

    it('retourne null si aucun prompt trouvé', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };
      mockQuery.eq.mockResolvedValue({ data: [], error: null });
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await journalPromptsService.getRandomPrompt();

      expect(result).toBeNull();
    });

    it('gère les erreurs correctement', async () => {
      const mockError = new Error('Database error');
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };
      mockQuery.eq.mockResolvedValue({ data: null, error: mockError });
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(journalPromptsService.getRandomPrompt()).rejects.toThrow('Database error');
    });
  });

  describe('getAllPrompts', () => {
    it('récupère tous les prompts actifs triés', async () => {
      const mockPrompts = [
        { id: '1', category: 'gratitude', difficulty_level: 1 },
        { id: '2', category: 'reflection', difficulty_level: 2 },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };
      mockQuery.order.mockResolvedValue({ data: mockPrompts, error: null });
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await journalPromptsService.getAllPrompts();

      expect(mockQuery.order).toHaveBeenCalledWith('category', { ascending: true });
      expect(mockQuery.order).toHaveBeenCalledWith('difficulty_level', { ascending: true });
      expect(result).toEqual(mockPrompts);
    });

    it('retourne un tableau vide si aucune donnée', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };
      mockQuery.order.mockResolvedValue({ data: null, error: null });
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await journalPromptsService.getAllPrompts();

      expect(result).toEqual([]);
    });
  });

  describe('incrementUsage', () => {
    it('utilise rpc pour incrémenter le compteur', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ error: null });

      await journalPromptsService.incrementUsage('test-id');

      expect(supabase.rpc).toHaveBeenCalledWith('increment', {
        table_name: 'journal_prompts',
        row_id: 'test-id',
        column_name: 'usage_count',
      });
    });

    it('utilise le fallback si rpc échoue', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ error: new Error('RPC failed') });

      const mockSelectQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { usage_count: 5 }, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(supabase.from).mockReturnValueOnce(mockSelectQuery as any).mockReturnValueOnce(mockUpdateQuery as any);

      await journalPromptsService.incrementUsage('test-id');

      expect(mockUpdateQuery.update).toHaveBeenCalledWith({ usage_count: 6 });
    });

    it('ne lève pas d\'erreur même en cas d\'échec', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ error: new Error('Failed') });
      
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(journalPromptsService.incrementUsage('test-id')).resolves.not.toThrow();
    });
  });
});
