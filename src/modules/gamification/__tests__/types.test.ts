/**
 * Gamification Module - Types Tests
 * Tests unitaires pour les types du module Gamification
 */

import { describe, it, expect } from 'vitest';
import type {
  Reward,
  RewardCategory,
  RewardRarity,
  DailyChallenge,
  ChallengeCategory,
  GamificationProgress,
  Achievement,
  LeaderboardUser,
  GamificationNotification,
  GamificationStats,
} from '../types';

describe('Gamification Module - Types', () => {
  describe('Reward interface', () => {
    it('accepte une récompense valide', () => {
      const reward: Reward = {
        id: '1',
        name: 'Dark Theme',
        description: 'Unlock the dark theme',
        icon: '🌙',
        cost: 100,
        category: 'theme',
        rarity: 'common',
        available: true,
        stock: 10,
        expiresAt: '2025-12-31T23:59:59Z',
      };
      expect(reward.id).toBe('1');
      expect(reward.category).toBe('theme');
      expect(reward.rarity).toBe('common');
    });

    it('accepte une récompense minimale', () => {
      const reward: Reward = {
        id: '2',
        name: 'Basic Avatar',
        description: 'A basic avatar',
        icon: '😊',
        cost: 0,
        category: 'avatar',
        rarity: 'common',
        available: true,
      };
      expect(reward.stock).toBeUndefined();
      expect(reward.expiresAt).toBeUndefined();
    });
  });

  describe('RewardCategory type', () => {
    it('accepte toutes les catégories valides', () => {
      const categories: RewardCategory[] = ['theme', 'avatar', 'boost', 'content', 'feature'];
      expect(categories.length).toBe(5);
      categories.forEach((cat) => {
        expect(['theme', 'avatar', 'boost', 'content', 'feature']).toContain(cat);
      });
    });
  });

  describe('RewardRarity type', () => {
    it('accepte toutes les raretés valides', () => {
      const rarities: RewardRarity[] = ['common', 'rare', 'epic', 'legendary'];
      expect(rarities.length).toBe(4);
    });
  });

  describe('DailyChallenge interface', () => {
    it('accepte un défi quotidien valide', () => {
      const challenge: DailyChallenge = {
        id: 'dc1',
        title: 'Complete 3 meditations',
        description: 'Finish 3 meditation sessions today',
        icon: '🧘',
        xpReward: 50,
        pointsReward: 25,
        progress: 1,
        target: 3,
        completed: false,
        expiresAt: '2025-01-16T00:00:00Z',
        category: 'meditation',
      };
      expect(challenge.progress).toBeLessThan(challenge.target);
      expect(challenge.completed).toBe(false);
    });

    it('accepte un défi complété', () => {
      const challenge: DailyChallenge = {
        id: 'dc2',
        title: 'Journal Entry',
        description: 'Write one journal entry',
        icon: '📝',
        xpReward: 25,
        pointsReward: 10,
        progress: 1,
        target: 1,
        completed: true,
        expiresAt: '2025-01-16T00:00:00Z',
        category: 'journal',
      };
      expect(challenge.progress).toBeGreaterThanOrEqual(challenge.target);
      expect(challenge.completed).toBe(true);
    });
  });

  describe('ChallengeCategory type', () => {
    it('accepte toutes les catégories de défis', () => {
      const categories: ChallengeCategory[] = ['scan', 'journal', 'meditation', 'social', 'wellness'];
      expect(categories.length).toBe(5);
    });
  });

  describe('GamificationProgress interface', () => {
    it('accepte une progression valide', () => {
      const progress: GamificationProgress = {
        userId: 'user123',
        level: 5,
        currentXp: 450,
        nextLevelXp: 500,
        totalPoints: 1250,
        streak: 7,
        longestStreak: 14,
        achievementsUnlocked: 12,
        totalAchievements: 50,
        badgesEarned: 8,
        totalBadges: 30,
        challengesCompleted: 25,
        rewardsClaimed: 5,
      };
      expect(progress.level).toBeGreaterThan(0);
      expect(progress.currentXp).toBeLessThanOrEqual(progress.nextLevelXp);
    });

    it('valide que currentXp peut être 0 au début d\'un niveau', () => {
      const progress: GamificationProgress = {
        userId: 'newUser',
        level: 1,
        currentXp: 0,
        nextLevelXp: 100,
        totalPoints: 0,
        streak: 0,
        longestStreak: 0,
        achievementsUnlocked: 0,
        totalAchievements: 50,
        badgesEarned: 0,
        totalBadges: 30,
        challengesCompleted: 0,
        rewardsClaimed: 0,
      };
      expect(progress.currentXp).toBe(0);
      expect(progress.level).toBe(1);
    });
  });

  describe('Achievement interface', () => {
    it('accepte un achievement débloqué', () => {
      const achievement: Achievement = {
        id: 'ach1',
        name: 'First Steps',
        description: 'Complete your first activity',
        icon: '🎉',
        category: 'milestone',
        rarity: 'common',
        progress: 1,
        maxProgress: 1,
        unlocked: true,
        unlockedAt: '2025-01-15T10:00:00Z',
        xpReward: 100,
      };
      expect(achievement.unlocked).toBe(true);
      expect(achievement.unlockedAt).toBeDefined();
    });

    it('accepte un achievement en progression', () => {
      const achievement: Achievement = {
        id: 'ach2',
        name: 'Meditation Master',
        description: 'Complete 100 meditation sessions',
        icon: '🧘',
        category: 'wellness',
        rarity: 'legendary',
        progress: 45,
        maxProgress: 100,
        unlocked: false,
        xpReward: 500,
      };
      expect(achievement.unlocked).toBe(false);
      expect(achievement.progress).toBeLessThan(achievement.maxProgress);
    });
  });

  describe('LeaderboardUser interface', () => {
    it('accepte un utilisateur du leaderboard', () => {
      const user: LeaderboardUser = {
        rank: 1,
        userId: 'top1',
        displayName: 'Champion',
        avatarUrl: 'https://example.com/avatar.png',
        points: 5000,
        level: 25,
        streak: 30,
        badges: ['master', 'pioneer', 'helper'],
        isCurrentUser: true,
      };
      expect(user.rank).toBe(1);
      expect(user.isCurrentUser).toBe(true);
    });

    it('accepte un utilisateur sans avatar', () => {
      const user: LeaderboardUser = {
        rank: 10,
        userId: 'user10',
        displayName: 'Player10',
        points: 1500,
        level: 10,
        streak: 5,
        badges: [],
      };
      expect(user.avatarUrl).toBeUndefined();
      expect(user.isCurrentUser).toBeUndefined();
    });
  });

  describe('GamificationNotification interface', () => {
    it('accepte une notification d\'achievement', () => {
      const notification: GamificationNotification = {
        id: 'notif1',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        description: 'You earned "First Steps"',
        icon: '🏆',
        rarity: 'common',
        xp: 100,
        timestamp: '2025-01-15T10:00:00Z',
        read: false,
      };
      expect(notification.type).toBe('achievement');
      expect(notification.read).toBe(false);
    });

    it('accepte une notification de level up', () => {
      const notification: GamificationNotification = {
        id: 'notif2',
        type: 'level_up',
        title: 'Level Up!',
        description: 'You reached level 5',
        icon: '⬆️',
        xp: 50,
        timestamp: '2025-01-15T11:00:00Z',
        read: true,
      };
      expect(notification.type).toBe('level_up');
      expect(notification.read).toBe(true);
    });

    it('accepte une notification de streak', () => {
      const notification: GamificationNotification = {
        id: 'notif3',
        type: 'streak',
        title: '7 Day Streak!',
        description: 'Keep it up!',
        icon: '🔥',
        points: 50,
        timestamp: '2025-01-15T12:00:00Z',
        read: false,
      };
      expect(notification.type).toBe('streak');
    });
  });

  describe('GamificationStats interface', () => {
    it('accepte des statistiques complètes', () => {
      const stats: GamificationStats = {
        totalXpEarned: 5000,
        totalPointsEarned: 2500,
        totalChallengesCompleted: 50,
        totalAchievementsUnlocked: 15,
        currentStreak: 7,
        longestStreak: 21,
        favoriteActivity: 'meditation',
        lastActivityDate: '2025-01-15',
        weeklyProgress: [
          { day: 'Mon', xp: 100, points: 50 },
          { day: 'Tue', xp: 150, points: 75 },
          { day: 'Wed', xp: 80, points: 40 },
          { day: 'Thu', xp: 200, points: 100 },
          { day: 'Fri', xp: 120, points: 60 },
          { day: 'Sat', xp: 90, points: 45 },
          { day: 'Sun', xp: 110, points: 55 },
        ],
      };
      expect(stats.weeklyProgress.length).toBe(7);
      expect(stats.favoriteActivity).toBe('meditation');
    });

    it('accepte des statistiques avec activité null', () => {
      const stats: GamificationStats = {
        totalXpEarned: 0,
        totalPointsEarned: 0,
        totalChallengesCompleted: 0,
        totalAchievementsUnlocked: 0,
        currentStreak: 0,
        longestStreak: 0,
        favoriteActivity: null,
        lastActivityDate: null,
        weeklyProgress: [],
      };
      expect(stats.favoriteActivity).toBeNull();
      expect(stats.lastActivityDate).toBeNull();
    });
  });
});
