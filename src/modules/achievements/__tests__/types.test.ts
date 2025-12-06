import { describe, it, expect } from 'vitest';
import {
  AchievementRarity,
  AchievementCategory,
  ConditionType,
  AchievementCondition,
  RewardType,
  AchievementReward,
  Achievement,
  UserAchievementProgress,
  UserBadge,
  AchievementStats,
  CreateAchievement,
  RecordProgress,
} from '../types';

// ============================================================================
// TESTS UNITAIRES
// ============================================================================

describe('Achievements Module - Zod Schemas', () => {
  describe('AchievementRarity', () => {
    it('valide les raretés correctes', () => {
      expect(() => AchievementRarity.parse('common')).not.toThrow();
      expect(() => AchievementRarity.parse('rare')).not.toThrow();
      expect(() => AchievementRarity.parse('epic')).not.toThrow();
      expect(() => AchievementRarity.parse('legendary')).not.toThrow();
    });

    it('rejette les raretés invalides', () => {
      expect(() => AchievementRarity.parse('invalid')).toThrow();
      expect(() => AchievementRarity.parse('')).toThrow();
      expect(() => AchievementRarity.parse(null)).toThrow();
    });
  });

  describe('AchievementCategory', () => {
    it('valide les catégories correctes', () => {
      expect(() => AchievementCategory.parse('wellbeing')).not.toThrow();
      expect(() => AchievementCategory.parse('social')).not.toThrow();
      expect(() => AchievementCategory.parse('learning')).not.toThrow();
      expect(() => AchievementCategory.parse('creativity')).not.toThrow();
      expect(() => AchievementCategory.parse('progress')).not.toThrow();
      expect(() => AchievementCategory.parse('milestone')).not.toThrow();
      expect(() => AchievementCategory.parse('special')).not.toThrow();
    });

    it('rejette les catégories invalides', () => {
      expect(() => AchievementCategory.parse('invalid')).toThrow();
      expect(() => AchievementCategory.parse('')).toThrow();
    });
  });

  describe('ConditionType', () => {
    it('valide les types de conditions', () => {
      expect(() => ConditionType.parse('session_count')).not.toThrow();
      expect(() => ConditionType.parse('streak_days')).not.toThrow();
      expect(() => ConditionType.parse('total_duration')).not.toThrow();
      expect(() => ConditionType.parse('score_threshold')).not.toThrow();
      expect(() => ConditionType.parse('module_completion')).not.toThrow();
      expect(() => ConditionType.parse('social_interaction')).not.toThrow();
      expect(() => ConditionType.parse('custom')).not.toThrow();
    });

    it('rejette les types invalides', () => {
      expect(() => ConditionType.parse('invalid_type')).toThrow();
    });
  });

  describe('AchievementCondition', () => {
    it('valide une condition complète', () => {
      const condition = {
        type: 'session_count',
        value: 10,
        metadata: { module: 'meditation' },
      };
      expect(() => AchievementCondition.parse(condition)).not.toThrow();
    });

    it('valide une condition sans metadata', () => {
      const condition = {
        type: 'streak_days',
        value: 7,
      };
      expect(() => AchievementCondition.parse(condition)).not.toThrow();
    });

    it('rejette une valeur négative', () => {
      const condition = {
        type: 'session_count',
        value: -5,
      };
      expect(() => AchievementCondition.parse(condition)).toThrow();
    });

    it('rejette un type manquant', () => {
      const condition = {
        value: 10,
      };
      expect(() => AchievementCondition.parse(condition)).toThrow();
    });
  });

  describe('RewardType', () => {
    it('valide les types de récompenses', () => {
      expect(() => RewardType.parse('xp')).not.toThrow();
      expect(() => RewardType.parse('badge')).not.toThrow();
      expect(() => RewardType.parse('unlock')).not.toThrow();
      expect(() => RewardType.parse('cosmetic')).not.toThrow();
    });

    it('rejette les types invalides', () => {
      expect(() => RewardType.parse('gold')).toThrow();
    });
  });

  describe('AchievementReward', () => {
    it('valide une récompense XP', () => {
      const reward = {
        type: 'xp',
        value: 100,
      };
      expect(() => AchievementReward.parse(reward)).not.toThrow();
    });

    it('valide une récompense badge', () => {
      const reward = {
        type: 'badge',
        value: 'first_meditation',
        metadata: { icon: 'lotus' },
      };
      expect(() => AchievementReward.parse(reward)).not.toThrow();
    });

    it('rejette un type manquant', () => {
      const reward = {
        value: 50,
      };
      expect(() => AchievementReward.parse(reward)).toThrow();
    });
  });

  describe('Achievement', () => {
    it('valide un achievement complet', () => {
      const achievement = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'First Steps',
        description: 'Complete your first meditation session',
        category: 'milestone',
        rarity: 'common',
        icon: '🌟',
        conditions: [
          {
            type: 'session_count',
            value: 1,
            metadata: { module: 'meditation' },
          },
        ],
        rewards: {
          xp: 50,
          badge: 'first_meditation',
        },
        is_hidden: false,
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => Achievement.parse(achievement)).not.toThrow();
    });

    it('valide un achievement caché', () => {
      const achievement = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Secret Master',
        description: 'Unlock a hidden achievement',
        category: 'special',
        rarity: 'legendary',
        conditions: [{ type: 'custom', value: 1 }],
        rewards: { xp: 500 },
        is_hidden: true,
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => Achievement.parse(achievement)).not.toThrow();
    });

    it('rejette un nom trop long', () => {
      const achievement = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'A'.repeat(101),
        description: 'Test',
        category: 'milestone',
        rarity: 'common',
        conditions: [{ type: 'session_count', value: 1 }],
        rewards: {},
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => Achievement.parse(achievement)).toThrow();
    });

    it('rejette une description trop longue', () => {
      const achievement = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test',
        description: 'A'.repeat(501),
        category: 'milestone',
        rarity: 'common',
        conditions: [{ type: 'session_count', value: 1 }],
        rewards: {},
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => Achievement.parse(achievement)).toThrow();
    });

    it('rejette sans conditions', () => {
      const achievement = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test',
        description: 'Test achievement',
        category: 'milestone',
        rarity: 'common',
        conditions: [],
        rewards: {},
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => Achievement.parse(achievement)).toThrow();
    });
  });

  describe('UserAchievementProgress', () => {
    it('valide une progression en cours', () => {
      const progress = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        achievement_id: '550e8400-e29b-41d4-a716-446655440000',
        progress: 50,
        current_value: 5,
        target_value: 10,
        unlocked: false,
        notified: false,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T11:00:00Z',
      };
      expect(() => UserAchievementProgress.parse(progress)).not.toThrow();
    });

    it('valide une progression complétée', () => {
      const progress = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        achievement_id: '550e8400-e29b-41d4-a716-446655440000',
        progress: 100,
        current_value: 10,
        target_value: 10,
        unlocked: true,
        unlocked_at: '2025-01-15T12:00:00Z',
        notified: true,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T12:00:00Z',
      };
      expect(() => UserAchievementProgress.parse(progress)).not.toThrow();
    });

    it('rejette un progress > 100', () => {
      const progress = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        achievement_id: '550e8400-e29b-41d4-a716-446655440000',
        progress: 150,
        current_value: 15,
        target_value: 10,
        unlocked: true,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T12:00:00Z',
      };
      expect(() => UserAchievementProgress.parse(progress)).toThrow();
    });

    it('rejette un progress négatif', () => {
      const progress = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        achievement_id: '550e8400-e29b-41d4-a716-446655440000',
        progress: -10,
        current_value: 0,
        target_value: 10,
        unlocked: false,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserAchievementProgress.parse(progress)).toThrow();
    });

    it('rejette une target_value invalide', () => {
      const progress = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        achievement_id: '550e8400-e29b-41d4-a716-446655440000',
        progress: 0,
        current_value: 0,
        target_value: 0,
        unlocked: false,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserAchievementProgress.parse(progress)).toThrow();
    });
  });

  describe('UserBadge', () => {
    it('valide un badge complet', () => {
      const badge = {
        id: '550e8400-e29b-41d4-a716-446655440004',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Meditation Master',
        description: 'Completed 100 meditation sessions',
        image_url: 'https://example.com/badge.png',
        awarded_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserBadge.parse(badge)).not.toThrow();
    });

    it('valide un badge sans image', () => {
      const badge = {
        id: '550e8400-e29b-41d4-a716-446655440004',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'First Step',
        description: 'Started your journey',
        awarded_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserBadge.parse(badge)).not.toThrow();
    });

    it('rejette une image_url invalide', () => {
      const badge = {
        id: '550e8400-e29b-41d4-a716-446655440004',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Test',
        description: 'Test badge',
        image_url: 'not-a-valid-url',
        awarded_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserBadge.parse(badge)).toThrow();
    });
  });

  describe('AchievementStats', () => {
    it('valide des statistiques complètes', () => {
      const stats = {
        total_achievements: 50,
        unlocked_achievements: 15,
        unlock_percentage: 30,
        common_count: 8,
        rare_count: 5,
        epic_count: 2,
        legendary_count: 0,
        total_xp_earned: 1500,
        recent_unlocks: [
          {
            id: '550e8400-e29b-41d4-a716-446655440002',
            user_id: '550e8400-e29b-41d4-a716-446655440003',
            achievement_id: '550e8400-e29b-41d4-a716-446655440000',
            progress: 100,
            current_value: 10,
            target_value: 10,
            unlocked: true,
            unlocked_at: '2025-01-15T12:00:00Z',
            notified: true,
            created_at: '2025-01-15T10:00:00Z',
            updated_at: '2025-01-15T12:00:00Z',
          },
        ],
      };
      expect(() => AchievementStats.parse(stats)).not.toThrow();
    });

    it('rejette un pourcentage > 100', () => {
      const stats = {
        total_achievements: 50,
        unlocked_achievements: 60,
        unlock_percentage: 120,
        common_count: 8,
        rare_count: 5,
        epic_count: 2,
        legendary_count: 0,
        total_xp_earned: 1500,
        recent_unlocks: [],
      };
      expect(() => AchievementStats.parse(stats)).toThrow();
    });

    it('rejette plus de 10 recent_unlocks', () => {
      const stats = {
        total_achievements: 50,
        unlocked_achievements: 15,
        unlock_percentage: 30,
        common_count: 8,
        rare_count: 5,
        epic_count: 2,
        legendary_count: 0,
        total_xp_earned: 1500,
        recent_unlocks: Array(11).fill({
          id: '550e8400-e29b-41d4-a716-446655440002',
          user_id: '550e8400-e29b-41d4-a716-446655440003',
          achievement_id: '550e8400-e29b-41d4-a716-446655440000',
          progress: 100,
          current_value: 10,
          target_value: 10,
          unlocked: true,
          unlocked_at: '2025-01-15T12:00:00Z',
          notified: true,
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T12:00:00Z',
        }),
      };
      expect(() => AchievementStats.parse(stats)).toThrow();
    });
  });

  describe('CreateAchievement', () => {
    it('valide un payload de création', () => {
      const payload = {
        name: 'New Achievement',
        description: 'A brand new achievement',
        category: 'progress',
        rarity: 'rare',
        icon: '🏆',
        conditions: [{ type: 'session_count', value: 20 }],
        rewards: { xp: 200 },
        is_hidden: false,
      };
      expect(() => CreateAchievement.parse(payload)).not.toThrow();
    });

    it('rejette un payload avec id', () => {
      const payload = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'New Achievement',
        description: 'A brand new achievement',
        category: 'progress',
        rarity: 'rare',
        conditions: [{ type: 'session_count', value: 20 }],
        rewards: {},
      };
      expect(() => CreateAchievement.parse(payload)).toThrow();
    });
  });

  describe('RecordProgress', () => {
    it('valide un enregistrement de progression simple', () => {
      const payload = {
        achievement_id: '550e8400-e29b-41d4-a716-446655440000',
        increment: 1,
      };
      expect(() => RecordProgress.parse(payload)).not.toThrow();
    });

    it('valide un enregistrement avec metadata', () => {
      const payload = {
        achievement_id: '550e8400-e29b-41d4-a716-446655440000',
        increment: 5,
        metadata: {
          module: 'meditation',
          session_id: '550e8400-e29b-41d4-a716-446655440005',
        },
      };
      expect(() => RecordProgress.parse(payload)).not.toThrow();
    });

    it('utilise la valeur par défaut pour increment', () => {
      const payload = {
        achievement_id: '550e8400-e29b-41d4-a716-446655440000',
      };
      const parsed = RecordProgress.parse(payload);
      expect(parsed.increment).toBe(1);
    });

    it('rejette un increment négatif', () => {
      const payload = {
        achievement_id: '550e8400-e29b-41d4-a716-446655440000',
        increment: -5,
      };
      expect(() => RecordProgress.parse(payload)).toThrow();
    });
  });
});
