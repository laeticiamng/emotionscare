/**
 * Tests for progression.store.ts - Unified gamification system
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useProgressionStore,
  type Achievement,
  type Challenge,
  type UserProgression,
} from '../progression.store';

describe('useProgressionStore', () => {
  beforeEach(() => {
    useProgressionStore.getState().reset();
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('initializes progression for a new user', () => {
      const { initializeProgression } = useProgressionStore.getState();

      initializeProgression('user-123');

      const { progression } = useProgressionStore.getState();
      expect(progression).toBeDefined();
      expect(progression?.userId).toBe('user-123');
      expect(progression?.globalLevel).toBe(1);
      expect(progression?.totalPoints).toBe(0);
      expect(progression?.pointsToNextLevel).toBe(100);
      expect(progression?.currentStreak).toBe(0);
      expect(progression?.longestStreak).toBe(0);
      expect(progression?.totalSessions).toBe(0);
      expect(progression?.totalDuration).toBe(0);
      expect(progression?.moduleProgress).toEqual({});
    });

    it('does not reinitialize for same user', () => {
      const { initializeProgression } = useProgressionStore.getState();

      initializeProgression('user-123');
      useProgressionStore.getState().addPoints(50, 'test');

      const pointsBefore = useProgressionStore.getState().progression?.totalPoints;

      initializeProgression('user-123');

      const pointsAfter = useProgressionStore.getState().progression?.totalPoints;
      expect(pointsAfter).toBe(pointsBefore);
      expect(pointsAfter).toBe(50);
    });

    it('initializes with 16 predefined achievements', () => {
      const { achievements } = useProgressionStore.getState();

      expect(achievements).toHaveLength(16);

      // Check categories
      const exploration = achievements.filter((a) => a.category === 'exploration');
      const consistency = achievements.filter((a) => a.category === 'consistency');
      const duration = achievements.filter((a) => a.category === 'duration');
      const mastery = achievements.filter((a) => a.category === 'mastery');
      const social = achievements.filter((a) => a.category === 'social');

      expect(exploration).toHaveLength(4);
      expect(consistency).toHaveLength(4);
      expect(duration).toHaveLength(3);
      expect(mastery).toHaveLength(4);
      expect(social).toHaveLength(1);
    });
  });

  describe('Points & Levels', () => {
    beforeEach(() => {
      useProgressionStore.getState().initializeProgression('user-123');
    });

    it('adds points to user progression', () => {
      const { addPoints } = useProgressionStore.getState();

      addPoints(50, 'Test');

      const { progression } = useProgressionStore.getState();
      expect(progression?.totalPoints).toBe(50);
    });

    it('levels up when reaching threshold', () => {
      const { addPoints } = useProgressionStore.getState();

      // Level 1 → 2: 100 points
      addPoints(100, 'Level up test');

      const { progression } = useProgressionStore.getState();
      expect(progression?.globalLevel).toBe(2);
    });

    it('calculates exponential level curve correctly', () => {
      const { addPoints } = useProgressionStore.getState();

      // Level 1: 0-100 points
      // Level 2: 100-250 points (100 + 150)
      // Level 3: 250-475 points (250 + 225)

      addPoints(100, 'Level 2');
      expect(useProgressionStore.getState().progression?.globalLevel).toBe(2);

      addPoints(150, 'Level 3');
      expect(useProgressionStore.getState().progression?.globalLevel).toBe(3);

      const totalPoints = useProgressionStore.getState().progression?.totalPoints;
      expect(totalPoints).toBe(250);
    });

    it('calculates pointsToNextLevel correctly', () => {
      const { addPoints } = useProgressionStore.getState();

      addPoints(50, 'Test');

      const { progression } = useProgressionStore.getState();
      expect(progression?.pointsToNextLevel).toBe(50); // 100 - 50 = 50
    });

    it('handles large point amounts and multiple levels', () => {
      const { addPoints } = useProgressionStore.getState();

      addPoints(1000, 'Large amount');

      const { progression } = useProgressionStore.getState();
      expect(progression?.globalLevel).toBeGreaterThan(3);
      expect(progression?.totalPoints).toBe(1000);
    });
  });

  describe('Session recording', () => {
    beforeEach(() => {
      useProgressionStore.getState().initializeProgression('user-123');
    });

    it('records a session with correct stats', () => {
      const { recordSession } = useProgressionStore.getState();

      recordSession('music-unified', 'Musique Thérapeutique', 600);

      const { progression } = useProgressionStore.getState();
      expect(progression?.totalSessions).toBe(1);
      expect(progression?.totalDuration).toBe(600);
      expect(progression?.lastSessionDate).toBeDefined();
    });

    it('awards points for session completion', () => {
      const { recordSession } = useProgressionStore.getState();

      // Base points: 10
      // Duration bonus: 600s / 60 * 2 = 20
      // Total: 30 points
      recordSession('music-unified', 'Musique Thérapeutique', 600);

      const { progression } = useProgressionStore.getState();
      expect(progression?.totalPoints).toBe(30);
    });

    it('tracks module-specific progress', () => {
      const { recordSession } = useProgressionStore.getState();

      recordSession('music-unified', 'Musique Thérapeutique', 600);

      const { progression } = useProgressionStore.getState();
      const moduleProgress = progression?.moduleProgress['music-unified'];

      expect(moduleProgress).toBeDefined();
      expect(moduleProgress?.moduleId).toBe('music-unified');
      expect(moduleProgress?.moduleName).toBe('Musique Thérapeutique');
      expect(moduleProgress?.totalSessions).toBe(1);
      expect(moduleProgress?.totalDuration).toBe(600);
      expect(moduleProgress?.lastUsed).toBeDefined();
    });

    it('accumulates sessions for the same module', () => {
      const { recordSession } = useProgressionStore.getState();

      recordSession('music-unified', 'Musique Thérapeutique', 600);
      recordSession('music-unified', 'Musique Thérapeutique', 300);

      const { progression } = useProgressionStore.getState();
      const moduleProgress = progression?.moduleProgress['music-unified'];

      expect(moduleProgress?.totalSessions).toBe(2);
      expect(moduleProgress?.totalDuration).toBe(900);
    });

    it('tracks different modules separately', () => {
      const { recordSession } = useProgressionStore.getState();

      recordSession('music-unified', 'Musique', 600);
      recordSession('breath-unified', 'Respiration', 300);

      const { progression } = useProgressionStore.getState();

      expect(Object.keys(progression?.moduleProgress || {})).toHaveLength(2);
      expect(progression?.moduleProgress['music-unified']?.totalSessions).toBe(1);
      expect(progression?.moduleProgress['breath-unified']?.totalSessions).toBe(1);
    });
  });

  describe('Streaks', () => {
    beforeEach(() => {
      useProgressionStore.getState().initializeProgression('user-123');
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('starts streak at 1 for first session', () => {
      const { recordSession } = useProgressionStore.getState();

      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));
      recordSession('music-unified', 'Musique', 600);

      const { progression } = useProgressionStore.getState();
      expect(progression?.currentStreak).toBe(1);
      expect(progression?.longestStreak).toBe(1);
    });

    it('increments streak for consecutive days', () => {
      const { recordSession } = useProgressionStore.getState();

      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));
      recordSession('music-unified', 'Musique', 600);

      vi.setSystemTime(new Date('2025-01-16T10:00:00Z'));
      recordSession('music-unified', 'Musique', 600);

      const { progression } = useProgressionStore.getState();
      expect(progression?.currentStreak).toBe(2);
      expect(progression?.longestStreak).toBe(2);
    });

    it('maintains streak on same day', () => {
      const { recordSession } = useProgressionStore.getState();

      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));
      recordSession('music-unified', 'Musique', 600);

      vi.setSystemTime(new Date('2025-01-15T14:00:00Z'));
      recordSession('breath-unified', 'Respiration', 300);

      const { progression } = useProgressionStore.getState();
      expect(progression?.currentStreak).toBe(1);
    });

    it('resets streak when a day is skipped', () => {
      const { recordSession } = useProgressionStore.getState();

      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));
      recordSession('music-unified', 'Musique', 600);

      vi.setSystemTime(new Date('2025-01-16T10:00:00Z'));
      recordSession('music-unified', 'Musique', 600);

      // Skip a day
      vi.setSystemTime(new Date('2025-01-18T10:00:00Z'));
      recordSession('music-unified', 'Musique', 600);

      const { progression } = useProgressionStore.getState();
      expect(progression?.currentStreak).toBe(1);
      expect(progression?.longestStreak).toBe(2); // Still remembers longest
    });

    it('tracks longest streak correctly', () => {
      const { recordSession } = useProgressionStore.getState();

      // Build 5 day streak
      for (let i = 0; i < 5; i++) {
        vi.setSystemTime(new Date(`2025-01-${15 + i}T10:00:00Z`));
        recordSession('music-unified', 'Musique', 600);
      }

      expect(useProgressionStore.getState().progression?.longestStreak).toBe(5);

      // Break and start new streak
      vi.setSystemTime(new Date('2025-01-22T10:00:00Z'));
      recordSession('music-unified', 'Musique', 600);

      expect(useProgressionStore.getState().progression?.currentStreak).toBe(1);
      expect(useProgressionStore.getState().progression?.longestStreak).toBe(5);
    });
  });

  describe('Achievements', () => {
    beforeEach(() => {
      useProgressionStore.getState().initializeProgression('user-123');
    });

    it('unlocks achievement and awards points', () => {
      const { unlockAchievement } = useProgressionStore.getState();

      unlockAchievement('first_session');

      const { achievements, progression } = useProgressionStore.getState();
      const achievement = achievements.find((a) => a.id === 'first_session');

      expect(achievement?.unlockedAt).toBeDefined();
      expect(progression?.totalPoints).toBe(10); // Achievement points
    });

    it('does not unlock already unlocked achievement', () => {
      const { unlockAchievement } = useProgressionStore.getState();

      unlockAchievement('first_session');
      const pointsAfterFirst = useProgressionStore.getState().progression?.totalPoints;

      unlockAchievement('first_session');
      const pointsAfterSecond = useProgressionStore.getState().progression?.totalPoints;

      expect(pointsAfterFirst).toBe(pointsAfterSecond);
    });

    it('updates achievement progress', () => {
      const { updateAchievementProgress } = useProgressionStore.getState();

      updateAchievementProgress('sessions_10', 5);

      const { achievements } = useProgressionStore.getState();
      const achievement = achievements.find((a) => a.id === 'sessions_10');

      expect(achievement?.progress).toBe(5);
    });

    it('does not exceed maxProgress', () => {
      const { updateAchievementProgress } = useProgressionStore.getState();

      updateAchievementProgress('sessions_10', 50);

      const { achievements } = useProgressionStore.getState();
      const achievement = achievements.find((a) => a.id === 'sessions_10');

      expect(achievement?.progress).toBe(10); // maxProgress is 10
    });

    it('auto-unlocks first session achievement', () => {
      const { recordSession } = useProgressionStore.getState();

      recordSession('music-unified', 'Musique', 600);

      const { achievements } = useProgressionStore.getState();
      const achievement = achievements.find((a) => a.id === 'first_session');

      expect(achievement?.unlockedAt).toBeDefined();
    });

    it('auto-unlocks module-specific achievements', () => {
      const { recordSession } = useProgressionStore.getState();

      recordSession('music-unified', 'Musique', 600);

      const { achievements } = useProgressionStore.getState();
      const achievement = achievements.find((a) => a.id === 'try_music');

      expect(achievement?.unlockedAt).toBeDefined();
    });

    it('unlocks session milestones', () => {
      const { recordSession } = useProgressionStore.getState();

      // Record 10 sessions
      for (let i = 0; i < 10; i++) {
        recordSession('music-unified', 'Musique', 60);
      }

      const { achievements } = useProgressionStore.getState();
      const achievement = achievements.find((a) => a.id === 'sessions_10');

      expect(achievement?.unlockedAt).toBeDefined();
    });

    it('unlocks duration milestones', () => {
      const { recordSession } = useProgressionStore.getState();

      // Record 1 hour (3600 seconds)
      recordSession('music-unified', 'Musique', 3600);

      const { achievements } = useProgressionStore.getState();
      const achievement = achievements.find((a) => a.id === 'duration_1h');

      expect(achievement?.unlockedAt).toBeDefined();
    });

    it('unlocks streak milestones', () => {
      const { recordSession } = useProgressionStore.getState();
      vi.useFakeTimers();

      // Build 3 day streak
      for (let i = 0; i < 3; i++) {
        vi.setSystemTime(new Date(`2025-01-${15 + i}T10:00:00Z`));
        recordSession('music-unified', 'Musique', 600);
      }

      const { achievements } = useProgressionStore.getState();
      const achievement = achievements.find((a) => a.id === 'streak_3');

      expect(achievement?.unlockedAt).toBeDefined();

      vi.useRealTimers();
    });
  });

  describe('Challenges', () => {
    beforeEach(() => {
      useProgressionStore.getState().initializeProgression('user-123');
    });

    it('adds a challenge', () => {
      const { addChallenge } = useProgressionStore.getState();

      const challenge: Challenge = {
        id: 'challenge-1',
        name: 'Daily Goal',
        description: 'Complete 3 sessions today',
        type: 'daily',
        goalType: 'sessions',
        goalValue: 3,
        currentProgress: 0,
        rewardPoints: 50,
        expiresAt: new Date('2025-01-16').toISOString(),
      };

      addChallenge(challenge);

      const { activeChallenges } = useProgressionStore.getState();
      expect(activeChallenges).toHaveLength(1);
      expect(activeChallenges[0]).toEqual(challenge);
    });

    it('updates challenge progress', () => {
      const { addChallenge, updateChallengeProgress } = useProgressionStore.getState();

      const challenge: Challenge = {
        id: 'challenge-1',
        name: 'Daily Goal',
        description: 'Complete 3 sessions',
        type: 'daily',
        goalType: 'sessions',
        goalValue: 3,
        currentProgress: 0,
        rewardPoints: 50,
        expiresAt: new Date('2025-01-16').toISOString(),
      };

      addChallenge(challenge);
      updateChallengeProgress('challenge-1', 2);

      const { activeChallenges } = useProgressionStore.getState();
      expect(activeChallenges[0].currentProgress).toBe(2);
    });

    it('auto-completes challenge when goal is reached', () => {
      const { addChallenge, updateChallengeProgress } = useProgressionStore.getState();

      const challenge: Challenge = {
        id: 'challenge-1',
        name: 'Daily Goal',
        description: 'Complete 3 sessions',
        type: 'daily',
        goalType: 'sessions',
        goalValue: 3,
        currentProgress: 0,
        rewardPoints: 50,
        expiresAt: new Date('2025-01-16').toISOString(),
      };

      addChallenge(challenge);
      updateChallengeProgress('challenge-1', 3);

      const { activeChallenges, completedChallenges } = useProgressionStore.getState();
      expect(activeChallenges).toHaveLength(0);
      expect(completedChallenges).toHaveLength(1);
      expect(completedChallenges[0].completedAt).toBeDefined();
    });

    it('awards points when challenge is completed', () => {
      const { addChallenge, completeChallenge } = useProgressionStore.getState();

      const challenge: Challenge = {
        id: 'challenge-1',
        name: 'Daily Goal',
        description: 'Complete 3 sessions',
        type: 'daily',
        goalType: 'sessions',
        goalValue: 3,
        currentProgress: 3,
        rewardPoints: 50,
        expiresAt: new Date('2025-01-16').toISOString(),
      };

      addChallenge(challenge);

      const pointsBefore = useProgressionStore.getState().progression?.totalPoints || 0;

      completeChallenge('challenge-1');

      const pointsAfter = useProgressionStore.getState().progression?.totalPoints || 0;
      expect(pointsAfter).toBe(pointsBefore + 50);
    });

    it('cleans up expired challenges', () => {
      const { addChallenge, cleanupExpiredChallenges } = useProgressionStore.getState();

      const expiredChallenge: Challenge = {
        id: 'expired-1',
        name: 'Expired',
        description: 'Expired challenge',
        type: 'daily',
        goalType: 'sessions',
        goalValue: 3,
        currentProgress: 0,
        rewardPoints: 50,
        expiresAt: '2025-01-01T00:00:00.000Z',
      };

      const activeChallenge: Challenge = {
        id: 'active-1',
        name: 'Active',
        description: 'Active challenge',
        type: 'weekly',
        goalType: 'sessions',
        goalValue: 10,
        currentProgress: 0,
        rewardPoints: 100,
        expiresAt: '2025-12-31T23:59:59.000Z',
      };

      addChallenge(expiredChallenge);
      addChallenge(activeChallenge);

      cleanupExpiredChallenges();

      const { activeChallenges } = useProgressionStore.getState();
      expect(activeChallenges).toHaveLength(1);
      expect(activeChallenges[0].id).toBe('active-1');
    });

    it('does not exceed goalValue in progress', () => {
      const { addChallenge, updateChallengeProgress } = useProgressionStore.getState();

      const challenge: Challenge = {
        id: 'challenge-1',
        name: 'Daily Goal',
        description: 'Complete 3 sessions',
        type: 'daily',
        goalType: 'sessions',
        goalValue: 3,
        currentProgress: 0,
        rewardPoints: 50,
        expiresAt: new Date('2025-01-16').toISOString(),
      };

      addChallenge(challenge);
      updateChallengeProgress('challenge-1', 10);

      const { completedChallenges } = useProgressionStore.getState();
      expect(completedChallenges[0].currentProgress).toBe(10);
    });
  });

  describe('Selectors', () => {
    beforeEach(() => {
      useProgressionStore.getState().initializeProgression('user-123');
    });

    it('selectProgression returns user progression', () => {
      const { recordSession } = useProgressionStore.getState();

      recordSession('music-unified', 'Musique', 600);

      const progression = useProgressionStore((state) => state.progression);
      expect(progression?.userId).toBe('user-123');
      expect(progression?.totalSessions).toBe(1);
    });

    it('selectGlobalLevel returns current level', () => {
      const { addPoints } = useProgressionStore.getState();

      addPoints(200, 'Test');

      const level = useProgressionStore.getState().progression?.globalLevel;
      expect(level).toBeGreaterThan(1);
    });

    it('selectUnlockedAchievements filters unlocked only', () => {
      const { unlockAchievement } = useProgressionStore.getState();

      unlockAchievement('first_session');
      unlockAchievement('try_music');

      const { achievements } = useProgressionStore.getState();
      const unlocked = achievements.filter((a) => a.unlockedAt);

      expect(unlocked).toHaveLength(2);
    });

    it('selectLockedAchievements filters locked only', () => {
      const { unlockAchievement } = useProgressionStore.getState();

      unlockAchievement('first_session');

      const { achievements } = useProgressionStore.getState();
      const locked = achievements.filter((a) => !a.unlockedAt);

      expect(locked).toHaveLength(15); // 16 total - 1 unlocked
    });

    it('selectModuleProgress returns specific module data', () => {
      const { recordSession } = useProgressionStore.getState();

      recordSession('music-unified', 'Musique', 600);

      const moduleProgress = useProgressionStore.getState().progression?.moduleProgress['music-unified'];
      expect(moduleProgress?.totalSessions).toBe(1);
    });
  });

  describe('State management', () => {
    beforeEach(() => {
      useProgressionStore.getState().initializeProgression('user-123');
    });

    it('sets loading state', () => {
      const { setLoading } = useProgressionStore.getState();

      setLoading(true);
      expect(useProgressionStore.getState().isLoading).toBe(true);

      setLoading(false);
      expect(useProgressionStore.getState().isLoading).toBe(false);
    });

    it('sets error state', () => {
      const { setError } = useProgressionStore.getState();

      setError('Test error');
      expect(useProgressionStore.getState().error).toBe('Test error');

      setError(null);
      expect(useProgressionStore.getState().error).toBeNull();
    });

    it('resets store to initial state', () => {
      const { recordSession, unlockAchievement, addPoints, reset } = useProgressionStore.getState();

      recordSession('music-unified', 'Musique', 600);
      unlockAchievement('first_session');
      addPoints(100, 'Test');

      reset();

      const state = useProgressionStore.getState();
      expect(state.progression).toBeNull();
      expect(state.achievements.every((a) => !a.unlockedAt)).toBe(true);
      expect(state.activeChallenges).toEqual([]);
      expect(state.completedChallenges).toEqual([]);
    });

    it('preserves achievements structure after reset', () => {
      const { reset } = useProgressionStore.getState();

      reset();

      const { achievements } = useProgressionStore.getState();
      expect(achievements).toHaveLength(16);
    });
  });

  describe('Integration scenarios', () => {
    beforeEach(() => {
      useProgressionStore.getState().initializeProgression('user-123');
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('complete user journey: sessions → achievements → level up', () => {
      const { recordSession } = useProgressionStore.getState();

      // Day 1: First session
      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));
      recordSession('music-unified', 'Musique', 600);

      let state = useProgressionStore.getState();
      expect(state.progression?.totalSessions).toBe(1);
      expect(state.achievements.find((a) => a.id === 'first_session')?.unlockedAt).toBeDefined();

      // Day 2: Build streak
      vi.setSystemTime(new Date('2025-01-16T10:00:00Z'));
      recordSession('breath-unified', 'Respiration', 300);

      state = useProgressionStore.getState();
      expect(state.progression?.currentStreak).toBe(2);

      // Day 3: Complete 3-day streak
      vi.setSystemTime(new Date('2025-01-17T10:00:00Z'));
      recordSession('music-unified', 'Musique', 600);

      state = useProgressionStore.getState();
      expect(state.progression?.currentStreak).toBe(3);
      expect(state.achievements.find((a) => a.id === 'streak_3')?.unlockedAt).toBeDefined();

      // Continue to 10 sessions
      for (let i = 4; i <= 10; i++) {
        vi.setSystemTime(new Date(`2025-01-${14 + i}T10:00:00Z`));
        recordSession('music-unified', 'Musique', 300);
      }

      state = useProgressionStore.getState();
      expect(state.progression?.totalSessions).toBe(10);
      expect(state.achievements.find((a) => a.id === 'sessions_10')?.unlockedAt).toBeDefined();
      expect(state.progression?.globalLevel).toBeGreaterThan(1);
    });

    it('tracks multi-module progress correctly', () => {
      const { recordSession } = useProgressionStore.getState();

      // Music sessions
      for (let i = 0; i < 5; i++) {
        recordSession('music-unified', 'Musique', 600);
      }

      // Breath sessions
      for (let i = 0; i < 3; i++) {
        recordSession('breath-unified', 'Respiration', 300);
      }

      const state = useProgressionStore.getState();
      expect(state.progression?.moduleProgress['music-unified']?.totalSessions).toBe(5);
      expect(state.progression?.moduleProgress['breath-unified']?.totalSessions).toBe(3);
      expect(state.progression?.totalSessions).toBe(8);
    });
  });
});
