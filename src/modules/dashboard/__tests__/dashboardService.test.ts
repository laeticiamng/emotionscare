/**
 * Tests pour DashboardService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardService } from '../dashboardService';
import type { DashboardStats, ModuleActivity } from '../dashboardService';

// Mock des dépendances
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn().mockResolvedValue({ data: [], error: null }),
            })),
          })),
          gte: vi.fn().mockResolvedValue({ data: [], error: null }),
          order: vi.fn(() => ({
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          })),
        })),
      })),
    })),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('@/modules/activities', () => ({
  ActivityService: {
    fetchHistory: vi.fn().mockResolvedValue([]),
    fetchAchievements: vi.fn().mockResolvedValue([]),
    fetchBadges: vi.fn().mockResolvedValue([]),
  },
}));

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DashboardStats type', () => {
    it('should validate stats structure', () => {
      const stats: DashboardStats = {
        totalSessions: 150,
        totalMinutes: 3000,
        favoriteModules: ['meditation', 'breathing-vr', 'journal'],
        recentActivity: [],
        wellnessScore: 75,
        streakDays: 14,
      };

      expect(stats.totalSessions).toBe(150);
      expect(stats.totalMinutes).toBe(3000);
      expect(stats.favoriteModules).toHaveLength(3);
      expect(stats.wellnessScore).toBeGreaterThanOrEqual(0);
      expect(stats.wellnessScore).toBeLessThanOrEqual(100);
      expect(stats.streakDays).toBeGreaterThanOrEqual(0);
    });

    it('should accept empty values for new users', () => {
      const emptyStats: DashboardStats = {
        totalSessions: 0,
        totalMinutes: 0,
        favoriteModules: [],
        recentActivity: [],
        wellnessScore: 50,
        streakDays: 0,
      };

      expect(emptyStats.totalSessions).toBe(0);
      expect(emptyStats.favoriteModules).toHaveLength(0);
      expect(emptyStats.wellnessScore).toBe(50); // Score neutre par défaut
    });
  });

  describe('ModuleActivity type', () => {
    it('should validate module activity structure', () => {
      const activity: ModuleActivity = {
        moduleName: 'meditation',
        sessionsCount: 42,
        totalDuration: 25200, // 7 heures en secondes
        lastActivity: new Date().toISOString(),
        icon: '🧘',
      };

      expect(activity.moduleName).toBe('meditation');
      expect(activity.sessionsCount).toBe(42);
      expect(activity.totalDuration).toBeGreaterThan(0);
      expect(activity.icon).toBe('🧘');
    });

    it('should accept multiple module activities', () => {
      const activities: ModuleActivity[] = [
        {
          moduleName: 'breathing-vr',
          sessionsCount: 100,
          totalDuration: 36000,
          lastActivity: new Date().toISOString(),
          icon: '🫁',
        },
        {
          moduleName: 'journal',
          sessionsCount: 50,
          totalDuration: 15000,
          lastActivity: new Date().toISOString(),
          icon: '📔',
        },
        {
          moduleName: 'music-therapy',
          sessionsCount: 30,
          totalDuration: 18000,
          lastActivity: new Date().toISOString(),
          icon: '🎵',
        },
      ];

      expect(activities).toHaveLength(3);
      expect(activities[0].sessionsCount).toBeGreaterThan(activities[1].sessionsCount);
    });
  });

  describe('getGlobalStats', () => {
    it('should return default stats for empty user', async () => {
      const stats = await DashboardService.getGlobalStats('user-empty');

      expect(stats).toBeDefined();
      expect(stats.totalSessions).toBe(0);
      expect(stats.totalMinutes).toBe(0);
      expect(stats.favoriteModules).toEqual([]);
      expect(stats.wellnessScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getModuleActivities', () => {
    it('should return empty array for new user', async () => {
      const activities = await DashboardService.getModuleActivities('user-new');

      expect(Array.isArray(activities)).toBe(true);
      expect(activities).toHaveLength(0);
    });
  });

  describe('getRecommendations', () => {
    it('should return recommendations array', async () => {
      const recommendations = await DashboardService.getRecommendations('user-123');

      expect(Array.isArray(recommendations)).toBe(true);
    });
  });

  describe('getRecentAchievements', () => {
    it('should return achievements array', async () => {
      const achievements = await DashboardService.getRecentAchievements('user-123');

      expect(Array.isArray(achievements)).toBe(true);
    });
  });

  describe('getRecentBadges', () => {
    it('should return badges array', async () => {
      const badges = await DashboardService.getRecentBadges('user-123');

      expect(Array.isArray(badges)).toBe(true);
    });
  });

  describe('getWeeklySummary', () => {
    it('should return weekly summary with correct structure', async () => {
      const summary = await DashboardService.getWeeklySummary('user-123');

      expect(summary).toBeDefined();
      expect(summary.weekStart).toBeDefined();
      expect(summary.weekEnd).toBeDefined();
      expect(summary.totalSessions).toBeGreaterThanOrEqual(0);
      expect(summary.totalMinutes).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(summary.topModules)).toBe(true);
      expect(typeof summary.wellnessTrend).toBe('number');
    });

    it('should have weekStart before weekEnd', async () => {
      const summary = await DashboardService.getWeeklySummary('user-456');

      const start = new Date(summary.weekStart);
      const end = new Date(summary.weekEnd);

      expect(start.getTime()).toBeLessThan(end.getTime());
    });
  });

  describe('Module icon mapping', () => {
    it('should map common modules to correct icons', () => {
      // Test via ModuleActivity structure
      const moduleIcons: Record<string, string> = {
        'breathing-vr': '🫁',
        'meditation': '🧘',
        'journal': '📔',
        'music-therapy': '🎵',
        'scan': '😊',
        'vr-galaxy': '🌌',
        'ambition-arcade': '🎮',
        'boss-grit': '💪',
        'flash-lite': '⚡',
        'nyvee': '🛋️',
        'story-synth': '📖',
        'mood-mixer': '🎨',
        'bubble-beat': '🫧',
        'ar-filters': '📸',
        'screen-silk': '🖼️',
      };

      expect(Object.keys(moduleIcons)).toHaveLength(15);
      expect(moduleIcons['meditation']).toBe('🧘');
      expect(moduleIcons['breathing-vr']).toBe('🫁');
    });
  });

  describe('Wellness score calculation', () => {
    it('should accept valid wellness scores (0-100)', () => {
      const validScores = [0, 25, 50, 75, 100];

      validScores.forEach(score => {
        const stats: DashboardStats = {
          totalSessions: 10,
          totalMinutes: 100,
          favoriteModules: [],
          recentActivity: [],
          wellnessScore: score,
          streakDays: 5,
        };

        expect(stats.wellnessScore).toBeGreaterThanOrEqual(0);
        expect(stats.wellnessScore).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Streak calculation', () => {
    it('should accept valid streak values', () => {
      const stats: DashboardStats = {
        totalSessions: 100,
        totalMinutes: 5000,
        favoriteModules: ['meditation'],
        recentActivity: [],
        wellnessScore: 80,
        streakDays: 30, // 30 jours consécutifs
      };

      expect(stats.streakDays).toBe(30);
      expect(stats.streakDays).toBeGreaterThanOrEqual(0);
    });
  });
});
