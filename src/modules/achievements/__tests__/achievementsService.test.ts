/**
 * Achievements Service - Tests Complets
 * Tests unitaires pour achievementsService
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { achievementsService } from '../achievementsService';

// ============================================================================
// MOCKS
// ============================================================================

const mockSupabaseResponse = <T>(data: T, error: { message: string; code?: string } | null = null) => ({
  data,
  error,
});

const mockChain = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => mockChain),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TEST DATA
// ============================================================================

const TEST_USER_ID = 'user-123';

const mockAchievement = {
  id: 'ach-1',
  name: 'Premier Pas',
  description: 'Complétez votre première session',
  icon: '🌟',
  category: 'onboarding',
  rarity: 'common',
  conditions: [{ type: 'sessions_completed', value: 1, operator: 'gte' }],
  rewards: { xp: 100, badge: true },
  is_hidden: false,
  created_at: new Date().toISOString(),
};

const mockProgress = {
  id: 'prog-1',
  user_id: TEST_USER_ID,
  achievement_id: 'ach-1',
  current_value: 0,
  target_value: 1,
  progress: 0,
  unlocked: false,
  notified: false,
  updated_at: new Date().toISOString(),
};

const mockBadge = {
  id: 'badge-1',
  user_id: TEST_USER_ID,
  name: 'Premier Pas',
  description: 'Badge de bienvenue',
  image_url: 'https://example.com/badge.png',
  awarded_at: new Date().toISOString(),
};

// ============================================================================
// TESTS
// ============================================================================

describe('achievementsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(mockChain).forEach(mock => {
      if (typeof mock === 'function' && mock.mockReturnThis) {
        mock.mockReturnThis();
      }
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // --------------------------------------------------------------------------
  // GET ALL ACHIEVEMENTS
  // --------------------------------------------------------------------------

  describe('getAllAchievements', () => {
    it('récupère tous les achievements visibles par défaut', async () => {
      mockChain.order.mockResolvedValue(mockSupabaseResponse([mockAchievement]));

      const result = await achievementsService.getAllAchievements();

      expect(supabase.from).toHaveBeenCalledWith('achievements');
      expect(mockChain.eq).toHaveBeenCalledWith('is_hidden', false);
      expect(result).toEqual([mockAchievement]);
    });

    it('inclut les achievements cachés si demandé', async () => {
      mockChain.order.mockResolvedValue(mockSupabaseResponse([mockAchievement]));

      await achievementsService.getAllAchievements(true);

      expect(mockChain.eq).not.toHaveBeenCalledWith('is_hidden', false);
    });

    it('trie par rareté', async () => {
      mockChain.order.mockResolvedValue(mockSupabaseResponse([]));

      await achievementsService.getAllAchievements();

      expect(mockChain.order).toHaveBeenCalledWith('rarity', { ascending: true });
    });

    it('retourne un tableau vide si pas de données', async () => {
      mockChain.order.mockResolvedValue(mockSupabaseResponse(null));

      const result = await achievementsService.getAllAchievements();

      expect(result).toEqual([]);
    });

    it('lance une erreur si la requête échoue', async () => {
      mockChain.order.mockResolvedValue(mockSupabaseResponse(null, { message: 'DB error' }));

      await expect(achievementsService.getAllAchievements()).rejects.toThrow('Failed to fetch achievements');
    });
  });

  // --------------------------------------------------------------------------
  // GET ACHIEVEMENT BY ID
  // --------------------------------------------------------------------------

  describe('getAchievementById', () => {
    it('récupère un achievement par ID', async () => {
      mockChain.single.mockResolvedValue(mockSupabaseResponse(mockAchievement));

      const result = await achievementsService.getAchievementById('ach-1');

      expect(mockChain.eq).toHaveBeenCalledWith('id', 'ach-1');
      expect(result).toEqual(mockAchievement);
    });

    it('retourne null si non trouvé (PGRST116)', async () => {
      mockChain.single.mockResolvedValue(mockSupabaseResponse(null, { message: 'Not found', code: 'PGRST116' }));

      const result = await achievementsService.getAchievementById('non-existent');

      expect(result).toBeNull();
    });

    it('lance une erreur pour autres erreurs', async () => {
      mockChain.single.mockResolvedValue(mockSupabaseResponse(null, { message: 'Server error' }));

      await expect(achievementsService.getAchievementById('ach-1')).rejects.toThrow('Failed to fetch achievement');
    });
  });

  // --------------------------------------------------------------------------
  // CREATE ACHIEVEMENT
  // --------------------------------------------------------------------------

  describe('createAchievement', () => {
    it('crée un nouvel achievement', async () => {
      mockChain.single.mockResolvedValue(mockSupabaseResponse(mockAchievement));

      const newAchievement = {
        name: 'Test Achievement',
        description: 'Test description',
        icon: '🎯',
        category: 'test',
        rarity: 'rare',
        conditions: [{ type: 'test', value: 5, operator: 'gte' }],
        rewards: { xp: 200 },
        is_hidden: false,
      } as any;

      const result = await achievementsService.createAchievement(newAchievement);

      expect(mockChain.insert).toHaveBeenCalledWith(newAchievement);
      expect(result).toEqual(mockAchievement);
    });

    it('lance une erreur si la création échoue', async () => {
      mockChain.single.mockResolvedValue(mockSupabaseResponse(null, { message: 'Insert failed' }));

      await expect(
        achievementsService.createAchievement({ name: 'Test' } as any)
      ).rejects.toThrow('Failed to create achievement');
    });
  });

  // --------------------------------------------------------------------------
  // UPDATE ACHIEVEMENT
  // --------------------------------------------------------------------------

  describe('updateAchievement', () => {
    it('met à jour un achievement existant', async () => {
      const updatedAchievement = { ...mockAchievement, name: 'Updated Name' };
      mockChain.single.mockResolvedValue(mockSupabaseResponse(updatedAchievement));

      const result = await achievementsService.updateAchievement({
        id: 'ach-1',
        name: 'Updated Name',
      });

      expect(mockChain.update).toHaveBeenCalledWith({ name: 'Updated Name' });
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'ach-1');
      expect(result.name).toBe('Updated Name');
    });

    it('lance une erreur si la mise à jour échoue', async () => {
      mockChain.single.mockResolvedValue(mockSupabaseResponse(null, { message: 'Update failed' }));

      await expect(
        achievementsService.updateAchievement({ id: 'ach-1', name: 'Test' })
      ).rejects.toThrow('Failed to update achievement');
    });
  });

  // --------------------------------------------------------------------------
  // DELETE ACHIEVEMENT
  // --------------------------------------------------------------------------

  describe('deleteAchievement', () => {
    it('supprime un achievement', async () => {
      mockChain.eq.mockResolvedValue(mockSupabaseResponse(null));

      await achievementsService.deleteAchievement('ach-1');

      expect(supabase.from).toHaveBeenCalledWith('achievements');
      expect(mockChain.delete).toHaveBeenCalled();
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'ach-1');
    });

    it('lance une erreur si la suppression échoue', async () => {
      mockChain.eq.mockResolvedValue(mockSupabaseResponse(null, { message: 'Delete failed' }));

      await expect(achievementsService.deleteAchievement('ach-1')).rejects.toThrow('Failed to delete achievement');
    });
  });

  // --------------------------------------------------------------------------
  // GET USER PROGRESS
  // --------------------------------------------------------------------------

  describe('getUserProgress', () => {
    it('récupère la progression de l\'utilisateur', async () => {
      mockChain.order.mockResolvedValue(mockSupabaseResponse([mockProgress]));

      const result = await achievementsService.getUserProgress(TEST_USER_ID);

      expect(supabase.from).toHaveBeenCalledWith('user_achievement_progress');
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', TEST_USER_ID);
      expect(result).toEqual([mockProgress]);
    });

    it('retourne un tableau vide si pas de progression', async () => {
      mockChain.order.mockResolvedValue(mockSupabaseResponse(null));

      const result = await achievementsService.getUserProgress(TEST_USER_ID);

      expect(result).toEqual([]);
    });
  });

  // --------------------------------------------------------------------------
  // GET UNLOCKED ACHIEVEMENTS
  // --------------------------------------------------------------------------

  describe('getUnlockedAchievements', () => {
    it('récupère uniquement les achievements débloqués', async () => {
      const unlockedProgress = { ...mockProgress, unlocked: true };
      mockChain.order.mockResolvedValue(mockSupabaseResponse([unlockedProgress]));

      const result = await achievementsService.getUnlockedAchievements(TEST_USER_ID);

      expect(mockChain.eq).toHaveBeenCalledWith('user_id', TEST_USER_ID);
      expect(mockChain.eq).toHaveBeenCalledWith('unlocked', true);
      expect(result).toEqual([unlockedProgress]);
    });
  });

  // --------------------------------------------------------------------------
  // RECORD PROGRESS
  // --------------------------------------------------------------------------

  describe('recordProgress', () => {
    beforeEach(() => {
      // Mock getAchievementById
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(mockAchievement));
    });

    it('crée une nouvelle progression si elle n\'existe pas', async () => {
      // Mock existing progress (not found)
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(null, { message: 'Not found', code: 'PGRST116' }));
      // Mock insert
      const newProgress = { ...mockProgress, current_value: 1, progress: 100, unlocked: true };
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(newProgress));
      // Mock grant rewards
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse({ total_xp: 0 }));
      mockChain.eq.mockResolvedValue(mockSupabaseResponse(null));

      const result = await achievementsService.recordProgress(TEST_USER_ID, {
        achievement_id: 'ach-1',
        increment: 1,
      });

      expect(mockChain.insert).toHaveBeenCalled();
      expect(result.unlocked).toBe(true);
    });

    it('met à jour une progression existante', async () => {
      // Mock existing progress
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(mockProgress));
      // Mock update
      const updatedProgress = { ...mockProgress, current_value: 1, progress: 100, unlocked: true };
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(updatedProgress));
      // Mock grant rewards
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse({ total_xp: 0 }));
      mockChain.eq.mockResolvedValue(mockSupabaseResponse(null));

      const result = await achievementsService.recordProgress(TEST_USER_ID, {
        achievement_id: 'ach-1',
        increment: 1,
      });

      expect(mockChain.update).toHaveBeenCalled();
      expect(result.unlocked).toBe(true);
    });

    it('plafonne la progression à 100%', async () => {
      const existingProgress = { ...mockProgress, current_value: 0 };
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(existingProgress));

      const updatedProgress = { ...mockProgress, current_value: 5, progress: 100, unlocked: true };
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(updatedProgress));
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse({ total_xp: 0 }));
      mockChain.eq.mockResolvedValue(mockSupabaseResponse(null));

      const result = await achievementsService.recordProgress(TEST_USER_ID, {
        achievement_id: 'ach-1',
        increment: 5,
      });

      // Progress should be capped at 100
      expect(result.progress).toBe(100);
    });

    it('lance une erreur si l\'achievement n\'existe pas', async () => {
      vi.clearAllMocks();
      mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(null, { message: 'Not found', code: 'PGRST116' }));

      await expect(
        achievementsService.recordProgress(TEST_USER_ID, {
          achievement_id: 'non-existent',
          increment: 1,
        })
      ).rejects.toThrow('Achievement not found');
    });
  });

  // --------------------------------------------------------------------------
  // GET TARGET VALUE
  // --------------------------------------------------------------------------

  describe('getTargetValue', () => {
    it('retourne la valeur de la première condition', () => {
      const conditions = [
        { type: 'sessions_completed', value: 10, operator: 'gte' },
        { type: 'xp_earned', value: 500, operator: 'gte' },
      ] as any;

      const result = achievementsService.getTargetValue(conditions);

      expect(result).toBe(10);
    });

    it('retourne 1 si pas de conditions', () => {
      const result = achievementsService.getTargetValue([]);

      expect(result).toBe(1);
    });

    it('retourne 1 si conditions vides', () => {
      const conditions = [{}] as any;

      const result = achievementsService.getTargetValue(conditions);

      expect(result).toBe(1);
    });
  });

  // --------------------------------------------------------------------------
  // GRANT XP
  // --------------------------------------------------------------------------

  describe('grantXP', () => {
    it('ajoute des XP au profil utilisateur', async () => {
      mockChain.single.mockResolvedValue(mockSupabaseResponse({ total_xp: 100 }));
      mockChain.eq.mockResolvedValue(mockSupabaseResponse(null));

      await achievementsService.grantXP(TEST_USER_ID, 50);

      expect(mockChain.update).toHaveBeenCalledWith({ total_xp: 150 });
    });

    it('gère le cas où le profil n\'a pas d\'XP', async () => {
      mockChain.single.mockResolvedValue(mockSupabaseResponse({ total_xp: null }));
      mockChain.eq.mockResolvedValue(mockSupabaseResponse(null));

      await achievementsService.grantXP(TEST_USER_ID, 50);

      expect(mockChain.update).toHaveBeenCalledWith({ total_xp: 50 });
    });
  });

  // --------------------------------------------------------------------------
  // GRANT BADGE
  // --------------------------------------------------------------------------

  describe('grantBadge', () => {
    it('crée un nouveau badge pour l\'utilisateur', async () => {
      mockChain.single.mockResolvedValue(mockSupabaseResponse(mockBadge));

      const result = await achievementsService.grantBadge(TEST_USER_ID, {
        name: 'Test Badge',
        description: 'Test description',
        image_url: 'https://example.com/badge.png',
      });

      expect(supabase.from).toHaveBeenCalledWith('user_badges');
      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: TEST_USER_ID,
          name: 'Test Badge',
          description: 'Test description',
          image_url: 'https://example.com/badge.png',
        })
      );
      expect(result).toEqual(mockBadge);
    });

    it('lance une erreur si la création échoue', async () => {
      mockChain.single.mockResolvedValue(mockSupabaseResponse(null, { message: 'Insert failed' }));

      await expect(
        achievementsService.grantBadge(TEST_USER_ID, { name: 'Test', description: 'Desc' })
      ).rejects.toThrow('Failed to grant badge');
    });
  });

  // --------------------------------------------------------------------------
  // GET USER BADGES
  // --------------------------------------------------------------------------

  describe('getUserBadges', () => {
    it('récupère tous les badges de l\'utilisateur', async () => {
      mockChain.order.mockResolvedValue(mockSupabaseResponse([mockBadge]));

      const result = await achievementsService.getUserBadges(TEST_USER_ID);

      expect(supabase.from).toHaveBeenCalledWith('user_badges');
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', TEST_USER_ID);
      expect(result).toEqual([mockBadge]);
    });

    it('trie par date d\'attribution', async () => {
      mockChain.order.mockResolvedValue(mockSupabaseResponse([]));

      await achievementsService.getUserBadges(TEST_USER_ID);

      expect(mockChain.order).toHaveBeenCalledWith('awarded_at', { ascending: false });
    });
  });

  // --------------------------------------------------------------------------
  // GET USER STATS
  // --------------------------------------------------------------------------

  describe('getUserStats', () => {
    it('calcule les statistiques complètes', async () => {
      const achievements = [
        { ...mockAchievement, id: 'ach-1', rarity: 'common' },
        { ...mockAchievement, id: 'ach-2', rarity: 'rare' },
        { ...mockAchievement, id: 'ach-3', rarity: 'epic' },
      ];

      const progress = [
        { ...mockProgress, achievement_id: 'ach-1', unlocked: true },
        { ...mockProgress, achievement_id: 'ach-2', unlocked: true },
      ];

      // Mock getAllAchievements
      mockChain.order.mockResolvedValueOnce(mockSupabaseResponse(achievements));
      // Mock getUserProgress
      mockChain.order.mockResolvedValueOnce(mockSupabaseResponse(progress));
      // Mock user profile
      mockChain.single.mockResolvedValue(mockSupabaseResponse({ total_xp: 500 }));

      const result = await achievementsService.getUserStats(TEST_USER_ID);

      expect(result.total_achievements).toBe(3);
      expect(result.unlocked_achievements).toBe(2);
      expect(result.unlock_percentage).toBeCloseTo(66.67, 1);
      expect(result.common_count).toBe(1);
      expect(result.rare_count).toBe(1);
      expect(result.epic_count).toBe(0);
      expect(result.total_xp_earned).toBe(500);
    });

    it('gère le cas sans achievements', async () => {
      mockChain.order.mockResolvedValueOnce(mockSupabaseResponse([]));
      mockChain.order.mockResolvedValueOnce(mockSupabaseResponse([]));
      mockChain.single.mockResolvedValue(mockSupabaseResponse({ total_xp: 0 }));

      const result = await achievementsService.getUserStats(TEST_USER_ID);

      expect(result.total_achievements).toBe(0);
      expect(result.unlock_percentage).toBe(0);
    });
  });

  // --------------------------------------------------------------------------
  // MARK AS NOTIFIED
  // --------------------------------------------------------------------------

  describe('markAsNotified', () => {
    it('marque plusieurs achievements comme notifiés', async () => {
      mockChain.in.mockResolvedValue(mockSupabaseResponse(null));

      await achievementsService.markAsNotified(TEST_USER_ID, ['ach-1', 'ach-2']);

      expect(mockChain.update).toHaveBeenCalledWith({ notified: true });
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', TEST_USER_ID);
      expect(mockChain.in).toHaveBeenCalledWith('achievement_id', ['ach-1', 'ach-2']);
    });

    it('lance une erreur si la mise à jour échoue', async () => {
      mockChain.in.mockResolvedValue(mockSupabaseResponse(null, { message: 'Update failed' }));

      await expect(
        achievementsService.markAsNotified(TEST_USER_ID, ['ach-1'])
      ).rejects.toThrow('Failed to mark achievements as notified');
    });
  });

  // --------------------------------------------------------------------------
  // GET UNNOTIFIED ACHIEVEMENTS
  // --------------------------------------------------------------------------

  describe('getUnnotifiedAchievements', () => {
    it('récupère les achievements débloqués non notifiés', async () => {
      const unnotified = [{ ...mockProgress, unlocked: true, notified: false }];
      mockChain.order.mockResolvedValue(mockSupabaseResponse(unnotified));

      const result = await achievementsService.getUnnotifiedAchievements(TEST_USER_ID);

      expect(mockChain.eq).toHaveBeenCalledWith('user_id', TEST_USER_ID);
      expect(mockChain.eq).toHaveBeenCalledWith('unlocked', true);
      expect(mockChain.eq).toHaveBeenCalledWith('notified', false);
      expect(result).toEqual(unnotified);
    });

    it('retourne un tableau vide si tous sont notifiés', async () => {
      mockChain.order.mockResolvedValue(mockSupabaseResponse([]));

      const result = await achievementsService.getUnnotifiedAchievements(TEST_USER_ID);

      expect(result).toEqual([]);
    });
  });
});
