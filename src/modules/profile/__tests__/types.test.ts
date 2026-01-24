/**
 * Tests pour les types du module Profile
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PREFERENCES,
  DEFAULT_STATS,
  calculateLevel,
  getRarityColor,
  getProfileCompletionPercentage,
} from '../types';
import type {
  UserProfile,
  ProfilePreferences,
  ProfileStats,
  AchievementRarity,
  AchievementCategory,
  Achievement,
  UserBadge,
  ActiveSession,
  SecurityInfo,
  ActivityHistoryItem,
  UpdateProfileInput,
} from '../types';

describe('Profile Types', () => {
  describe('DEFAULT_PREFERENCES', () => {
    it('should have all required preference fields', () => {
      expect(DEFAULT_PREFERENCES.theme).toBe('system');
      expect(DEFAULT_PREFERENCES.language).toBe('fr');
      expect(DEFAULT_PREFERENCES.timezone).toBe('Europe/Paris');
      expect(DEFAULT_PREFERENCES.notifications_enabled).toBe(true);
      expect(DEFAULT_PREFERENCES.email_notifications).toBe(true);
      expect(DEFAULT_PREFERENCES.push_notifications).toBe(true);
      expect(DEFAULT_PREFERENCES.sound_enabled).toBe(true);
      expect(DEFAULT_PREFERENCES.public_profile).toBe(false);
      expect(DEFAULT_PREFERENCES.share_stats).toBe(false);
      expect(DEFAULT_PREFERENCES.analytics_opt_in).toBe(true);
    });

    it('should have privacy-safe defaults', () => {
      // Vérifier que les paramètres de confidentialité sont sécurisés par défaut
      expect(DEFAULT_PREFERENCES.public_profile).toBe(false);
      expect(DEFAULT_PREFERENCES.share_stats).toBe(false);
    });
  });

  describe('DEFAULT_STATS', () => {
    it('should initialize all stats to zero or base values', () => {
      expect(DEFAULT_STATS.totalScans).toBe(0);
      expect(DEFAULT_STATS.totalJournalEntries).toBe(0);
      expect(DEFAULT_STATS.totalBreathingSessions).toBe(0);
      expect(DEFAULT_STATS.totalMeditations).toBe(0);
      expect(DEFAULT_STATS.totalMusicSessions).toBe(0);
      expect(DEFAULT_STATS.currentStreak).toBe(0);
      expect(DEFAULT_STATS.longestStreak).toBe(0);
      expect(DEFAULT_STATS.totalBadges).toBe(0);
      expect(DEFAULT_STATS.level).toBe(1);
      expect(DEFAULT_STATS.xp).toBe(0);
      expect(DEFAULT_STATS.xpToNextLevel).toBe(100);
    });

    it('should start at level 1 (not 0)', () => {
      expect(DEFAULT_STATS.level).toBeGreaterThanOrEqual(1);
    });
  });

  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      const result = calculateLevel(0);
      expect(result.level).toBe(1);
      expect(result.currentXp).toBe(0);
      expect(result.xpToNext).toBe(100);
    });

    it('should stay at level 1 with partial XP', () => {
      const result = calculateLevel(50);
      expect(result.level).toBe(1);
      expect(result.currentXp).toBe(50);
      expect(result.xpToNext).toBe(100);
    });

    it('should advance to level 2 at 100 XP', () => {
      const result = calculateLevel(100);
      expect(result.level).toBe(2);
      expect(result.currentXp).toBe(0);
      expect(result.xpToNext).toBe(200);
    });

    it('should correctly calculate higher levels', () => {
      // Level 1: 0-99 (100 XP needed)
      // Level 2: 100-299 (200 XP needed)
      // Level 3: 300-599 (300 XP needed)
      const result = calculateLevel(350);
      expect(result.level).toBe(3);
      expect(result.currentXp).toBe(50); // 350 - 100 - 200 = 50
      expect(result.xpToNext).toBe(300);
    });

    it('should handle large XP values', () => {
      const result = calculateLevel(10000);
      expect(result.level).toBeGreaterThan(10);
      expect(result.currentXp).toBeLessThan(result.xpToNext);
    });
  });

  describe('getRarityColor', () => {
    it('should return correct color for common rarity', () => {
      expect(getRarityColor('common')).toBe('bg-muted text-muted-foreground');
    });

    it('should return correct color for rare rarity', () => {
      expect(getRarityColor('rare')).toBe('bg-blue-500/20 text-blue-600');
    });

    it('should return correct color for epic rarity', () => {
      expect(getRarityColor('epic')).toBe('bg-purple-500/20 text-purple-600');
    });

    it('should return correct color for legendary rarity', () => {
      expect(getRarityColor('legendary')).toBe('bg-amber-500/20 text-amber-600');
    });

    it('should handle all rarity types', () => {
      const rarities: AchievementRarity[] = ['common', 'rare', 'epic', 'legendary'];
      rarities.forEach(rarity => {
        const color = getRarityColor(rarity);
        expect(color).toBeDefined();
        expect(color).toContain('bg-');
        expect(color).toContain('text-');
      });
    });
  });

  describe('getProfileCompletionPercentage', () => {
    it('should return 0% for empty profile', () => {
      const profile: UserProfile = {
        id: 'user-1',
        name: null,
        email: 'test@test.com',
        role: 'b2c',
        bio: null,
        phone: null,
        location: null,
        website: null,
        avatar_url: null,
        department: null,
        job_title: null,
        emotional_score: null,
        subscription_plan: null,
        credits_left: null,
        org_id: null,
        team_id: null,
        preferences: DEFAULT_PREFERENCES,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(getProfileCompletionPercentage(profile)).toBe(0);
    });

    it('should return 100% for fully completed profile', () => {
      const profile: UserProfile = {
        id: 'user-2',
        name: 'Jean Dupont',
        email: 'jean@test.com',
        role: 'b2c',
        bio: 'Passionné de bien-être',
        phone: '+33612345678',
        location: 'Paris, France',
        website: 'https://jean.com',
        avatar_url: 'https://example.com/avatar.jpg',
        department: 'R&D',
        job_title: 'Développeur',
        emotional_score: 75,
        subscription_plan: 'premium',
        credits_left: 100,
        org_id: null,
        team_id: null,
        preferences: DEFAULT_PREFERENCES,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(getProfileCompletionPercentage(profile)).toBe(100);
    });

    it('should return partial percentage for incomplete profile', () => {
      const profile: UserProfile = {
        id: 'user-3',
        name: 'Marie Martin',
        email: 'marie@test.com',
        role: 'b2c',
        bio: 'Bio complète',
        phone: null,
        location: null,
        website: null,
        avatar_url: 'https://example.com/marie.jpg',
        department: null,
        job_title: null,
        emotional_score: null,
        subscription_plan: null,
        credits_left: null,
        org_id: null,
        team_id: null,
        preferences: DEFAULT_PREFERENCES,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const percentage = getProfileCompletionPercentage(profile);
      expect(percentage).toBeGreaterThan(0);
      expect(percentage).toBeLessThan(100);
    });
  });

  describe('UserProfile', () => {
    it('should accept all valid roles', () => {
      const roles: UserProfile['role'][] = ['b2c', 'b2b_user', 'b2b_admin', 'admin'];
      expect(roles).toHaveLength(4);
    });
  });

  describe('Achievement', () => {
    it('should validate achievement structure', () => {
      const achievement: Achievement = {
        id: 'ach-1',
        name: 'Premier Scan',
        description: 'Effectuez votre premier scan émotionnel',
        icon: '🔍',
        rarity: 'common',
        category: 'milestone',
        target: 1,
        progress: 0,
        unlocked: false,
        unlockedAt: null,
      };

      expect(achievement.id).toBeDefined();
      expect(achievement.rarity).toBe('common');
      expect(achievement.unlocked).toBe(false);
    });

    it('should handle unlocked achievements', () => {
      const achievement: Achievement = {
        id: 'ach-2',
        name: 'Expert Respiration',
        description: '100 séances de respiration',
        icon: '🌬️',
        rarity: 'legendary',
        category: 'activity',
        target: 100,
        progress: 100,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };

      expect(achievement.unlocked).toBe(true);
      expect(achievement.unlockedAt).not.toBeNull();
    });
  });

  describe('SecurityInfo', () => {
    it('should validate security structure', () => {
      const security: SecurityInfo = {
        password_last_changed: new Date().toISOString(),
        password_strength: 'strong',
        two_factor_enabled: true,
        active_sessions_count: 2,
        last_login: new Date().toISOString(),
        last_login_ip: '192.168.1.1',
      };

      expect(security.password_strength).toBe('strong');
      expect(security.two_factor_enabled).toBe(true);
    });

    it('should accept all password strength values', () => {
      const strengths: SecurityInfo['password_strength'][] = ['weak', 'medium', 'strong'];
      expect(strengths).toHaveLength(3);
    });
  });

  describe('ActivityHistoryItem', () => {
    it('should validate activity history structure', () => {
      const activity: ActivityHistoryItem = {
        date: '2024-01-15',
        scans: 3,
        breathing: 2,
        journals: 1,
        meditations: 1,
        music: 4,
      };

      expect(activity.date).toBe('2024-01-15');
      expect(activity.scans).toBe(3);
    });
  });
});
