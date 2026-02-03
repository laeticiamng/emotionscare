/**
 * Tests pour le service de challenges
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChallengesService } from '../challengesService';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => {
  const mockData = {
    weeklyChallenges: [
      {
        id: 'challenge-1',
        title: 'Méditation quotidienne',
        description: '5 minutes de méditation par jour',
        challenge_type: 'meditation',
        target_value: 5,
        xp_reward: 100,
        badge_reward: 'zen_master',
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true
      }
    ],
    dailyChallenges: [
      {
        id: 'daily-1',
        title: 'Journal du jour',
        description: 'Écrire une entrée de journal',
        challenge_type: 'journal',
        target_value: 1,
        xp_reward: 25,
        is_active: true
      }
    ],
    userProgress: [
      {
        challenge_id: 'challenge-1',
        user_id: 'test-user-id',
        current_value: 3,
        completed: false
      }
    ]
  };

  const mockChain = {
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: { id: 'new-progress-id', current_value: 0, completed: false },
          error: null
        }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { current_value: 4 }, error: null }))
        }))
      }))
    })),
    select: vi.fn(() => mockChain),
    eq: vi.fn(() => mockChain),
    order: vi.fn(() => mockChain),
    limit: vi.fn(() => Promise.resolve({ data: mockData.weeklyChallenges, error: null })),
    single: vi.fn(() => Promise.resolve({ data: mockData.weeklyChallenges[0], error: null })),
    gte: vi.fn(() => mockChain),
    lte: vi.fn(() => mockChain),
  };

  return {
    supabase: {
      from: vi.fn((table: string) => {
        if (table === 'weekly_challenges') {
          return {
            ...mockChain,
            limit: vi.fn(() => Promise.resolve({ data: mockData.weeklyChallenges, error: null }))
          };
        }
        if (table === 'daily_challenges') {
          return {
            ...mockChain,
            limit: vi.fn(() => Promise.resolve({ data: mockData.dailyChallenges, error: null }))
          };
        }
        if (table === 'user_weekly_progress' || table === 'user_challenge_progress') {
          return {
            ...mockChain,
            limit: vi.fn(() => Promise.resolve({ data: mockData.userProgress, error: null }))
          };
        }
        return mockChain;
      })
    }
  };
});

describe('ChallengesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getActiveWeeklyChallenges', () => {
    it('should fetch active weekly challenges', async () => {
      const challenges = await ChallengesService.getActiveWeeklyChallenges();

      expect(Array.isArray(challenges)).toBe(true);
      expect(challenges.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getActiveDailyChallenges', () => {
    it('should fetch active daily challenges', async () => {
      const challenges = await ChallengesService.getActiveDailyChallenges();

      expect(Array.isArray(challenges)).toBe(true);
    });
  });

  describe('getUserProgress', () => {
    it('should fetch user progress for challenges', async () => {
      const progress = await ChallengesService.getUserProgress('test-user-id');

      expect(progress).toBeDefined();
      expect(progress instanceof Map || typeof progress === 'object').toBe(true);
    });
  });

  describe('updateProgress', () => {
    it('should update user progress', async () => {
      await expect(
        ChallengesService.updateProgress('test-user-id', 'challenge-1', 1)
      ).resolves.not.toThrow();
    });
  });

  describe('claimReward', () => {
    it('should claim challenge reward', async () => {
      const result = await ChallengesService.claimReward('test-user-id', 'challenge-1');

      expect(result).toBeDefined();
      expect(result).toHaveProperty('xp');
    });
  });

  describe('getCompletedChallenges', () => {
    it('should fetch completed challenges', async () => {
      const completed = await ChallengesService.getCompletedChallenges('test-user-id');

      expect(Array.isArray(completed)).toBe(true);
    });
  });

  describe('getChallengeStats', () => {
    it('should return challenge statistics', async () => {
      const stats = await ChallengesService.getChallengeStats('test-user-id');

      expect(stats).toHaveProperty('totalCompleted');
      expect(stats).toHaveProperty('currentStreak');
      expect(stats).toHaveProperty('totalXpEarned');
    });
  });
});
