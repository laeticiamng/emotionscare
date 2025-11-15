/**
 * Shared Zustand Store - Unified Progression
 * Système unifié de progression cross-module avec achievements et challenges
 *
 * SEMAINE 5 - Gamification unifiée
 *
 * @module store/progression.store
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'consistency' | 'duration' | 'mastery' | 'exploration' | 'social';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  goalType: 'sessions' | 'duration' | 'streaks' | 'modules';
  goalValue: number;
  currentProgress: number;
  rewardPoints: number;
  expiresAt: string;
  completedAt?: string;
}

export interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  level: number;
  totalSessions: number;
  totalDuration: number;
  lastUsed?: string;
}

export interface UserProgression {
  userId: string;

  // Global level
  globalLevel: number;
  totalPoints: number;
  pointsToNextLevel: number;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastSessionDate?: string;

  // Overall stats
  totalSessions: number;
  totalDuration: number;

  // Module-specific progress
  moduleProgress: Record<string, ModuleProgress>;
}

interface ProgressionState {
  progression: UserProgression | null;
  achievements: Achievement[];
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  isLoading: boolean;
  error: string | null;
}

interface ProgressionActions {
  // Initialization
  initializeProgression: (userId: string) => void;

  // Points & Levels
  addPoints: (points: number, reason: string) => void;

  // Sessions
  recordSession: (moduleId: string, moduleName: string, durationSeconds: number) => void;

  // Streaks
  checkStreak: () => void;

  // Achievements
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;

  // Challenges
  addChallenge: (challenge: Challenge) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  completeChallenge: (challengeId: string) => void;
  cleanupExpiredChallenges: () => void;

  // State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type ProgressionStore = ProgressionState & ProgressionActions;

// ============================================================================
// LEVEL SYSTEM
// ============================================================================

const POINTS_PER_LEVEL = 100;
const LEVEL_MULTIPLIER = 1.5;

function calculateLevel(totalPoints: number): { level: number; pointsToNext: number } {
  let level = 1;
  let pointsRequired = POINTS_PER_LEVEL;
  let pointsUsed = 0;

  while (pointsUsed + pointsRequired <= totalPoints) {
    pointsUsed += pointsRequired;
    level++;
    pointsRequired = Math.floor(POINTS_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, level - 1));
  }

  return {
    level,
    pointsToNext: pointsRequired - (totalPoints - pointsUsed),
  };
}

// ============================================================================
// PREDEFINED ACHIEVEMENTS
// ============================================================================

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Exploration
  { id: 'first_session', name: 'Premier Pas', description: 'Première session complétée', category: 'exploration', icon: '🌟', rarity: 'common', points: 10, maxProgress: 1, progress: 0 },
  { id: 'try_music', name: 'Mélomane', description: 'Essayez un module musical', category: 'exploration', icon: '🎵', rarity: 'common', points: 15, maxProgress: 1, progress: 0 },
  { id: 'try_breath', name: 'Respirateur', description: 'Essayez un module de respiration', category: 'exploration', icon: '🌬️', rarity: 'common', points: 15, maxProgress: 1, progress: 0 },
  { id: 'all_modules', name: 'Explorateur Complet', description: 'Essayez tous les types de modules', category: 'exploration', icon: '🗺️', rarity: 'epic', points: 150, maxProgress: 5, progress: 0 },

  // Consistency
  { id: 'streak_3', name: 'Bon Début', description: '3 jours de suite', category: 'consistency', icon: '🔥', rarity: 'common', points: 20, maxProgress: 3, progress: 0 },
  { id: 'streak_7', name: 'Semaine Complète', description: '7 jours de suite', category: 'consistency', icon: '⚡', rarity: 'rare', points: 50, maxProgress: 7, progress: 0 },
  { id: 'streak_30', name: 'Mois Parfait', description: '30 jours de suite', category: 'consistency', icon: '⭐', rarity: 'epic', points: 200, maxProgress: 30, progress: 0 },
  { id: 'streak_100', name: 'Centurion', description: '100 jours de suite', category: 'consistency', icon: '👑', rarity: 'legendary', points: 1000, maxProgress: 100, progress: 0 },

  // Duration
  { id: 'duration_1h', name: 'Première Heure', description: '1 heure de pratique totale', category: 'duration', icon: '⏱️', rarity: 'common', points: 25, maxProgress: 3600, progress: 0 },
  { id: 'duration_10h', name: 'Marathonien', description: '10 heures de pratique', category: 'duration', icon: '🏃', rarity: 'epic', points: 250, maxProgress: 36000, progress: 0 },
  { id: 'duration_100h', name: 'Maître du Temps', description: '100 heures de pratique', category: 'duration', icon: '🧘', rarity: 'legendary', points: 2500, maxProgress: 360000, progress: 0 },

  // Mastery
  { id: 'sessions_10', name: 'Apprenti', description: '10 sessions complétées', category: 'mastery', icon: '📚', rarity: 'common', points: 30, maxProgress: 10, progress: 0 },
  { id: 'sessions_50', name: 'Pratiquant Assidu', description: '50 sessions', category: 'mastery', icon: '💪', rarity: 'rare', points: 100, maxProgress: 50, progress: 0 },
  { id: 'sessions_100', name: 'Expert', description: '100 sessions', category: 'mastery', icon: '🏆', rarity: 'epic', points: 250, maxProgress: 100, progress: 0 },
  { id: 'sessions_500', name: 'Grand Maître', description: '500 sessions', category: 'mastery', icon: '👑', rarity: 'legendary', points: 1500, maxProgress: 500, progress: 0 },

  // Social
  { id: 'share_first', name: 'Partage', description: 'Partagez votre première session', category: 'social', icon: '🤝', rarity: 'common', points: 15, maxProgress: 1, progress: 0 },
];

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ProgressionState = {
  progression: null,
  achievements: INITIAL_ACHIEVEMENTS,
  activeChallenges: [],
  completedChallenges: [],
  isLoading: false,
  error: null,
};

// ============================================================================
// STORE
// ============================================================================

export const useProgressionStore = create<ProgressionStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Initialize
        initializeProgression: (userId) => {
          if (get().progression?.userId === userId) return;

          set({
            progression: {
              userId,
              globalLevel: 1,
              totalPoints: 0,
              pointsToNextLevel: POINTS_PER_LEVEL,
              currentStreak: 0,
              longestStreak: 0,
              totalSessions: 0,
              totalDuration: 0,
              moduleProgress: {},
            },
          }, false, 'initializeProgression');
        },

        // Add points
        addPoints: (points, reason) => {
          const { progression } = get();
          if (!progression) return;

          const newTotal = progression.totalPoints + points;
          const { level, pointsToNext } = calculateLevel(newTotal);

          set({
            progression: {
              ...progression,
              totalPoints: newTotal,
              globalLevel: level,
              pointsToNextLevel: pointsToNext,
            },
          }, false, `addPoints: ${reason} (+${points})`);
        },

        // Record session
        recordSession: (moduleId, moduleName, durationSeconds) => {
          const { progression } = get();
          if (!progression) return;

          const now = new Date().toISOString();
          const newTotalSessions = progression.totalSessions + 1;
          const newTotalDuration = progression.totalDuration + durationSeconds;

          // Update module progress
          const currentModuleProgress = progression.moduleProgress[moduleId] || {
            moduleId,
            moduleName,
            level: 1,
            totalSessions: 0,
            totalDuration: 0,
          };

          const updatedModuleProgress = {
            ...currentModuleProgress,
            totalSessions: currentModuleProgress.totalSessions + 1,
            totalDuration: currentModuleProgress.totalDuration + durationSeconds,
            lastUsed: now,
          };

          set({
            progression: {
              ...progression,
              totalSessions: newTotalSessions,
              totalDuration: newTotalDuration,
              lastSessionDate: now,
              moduleProgress: {
                ...progression.moduleProgress,
                [moduleId]: updatedModuleProgress,
              },
            },
          }, false, 'recordSession');

          // Award points
          const basePoints = 10;
          const durationBonus = Math.floor(durationSeconds / 60) * 2;
          get().addPoints(basePoints + durationBonus, `Session ${moduleName}`);

          // Check achievements
          if (newTotalSessions === 1) get().unlockAchievement('first_session');
          if (newTotalSessions === 10) get().unlockAchievement('sessions_10');
          if (newTotalSessions === 50) get().unlockAchievement('sessions_50');
          if (newTotalSessions === 100) get().unlockAchievement('sessions_100');
          if (newTotalSessions === 500) get().unlockAchievement('sessions_500');

          if (newTotalDuration >= 3600) get().unlockAchievement('duration_1h');
          if (newTotalDuration >= 36000) get().unlockAchievement('duration_10h');
          if (newTotalDuration >= 360000) get().unlockAchievement('duration_100h');

          // Module-specific achievements
          if (moduleId.includes('music')) get().unlockAchievement('try_music');
          if (moduleId.includes('breath')) get().unlockAchievement('try_breath');

          // Update achievement progress
          get().updateAchievementProgress('sessions_10', newTotalSessions);
          get().updateAchievementProgress('sessions_50', newTotalSessions);
          get().updateAchievementProgress('sessions_100', newTotalSessions);
          get().updateAchievementProgress('sessions_500', newTotalSessions);
          get().updateAchievementProgress('duration_1h', newTotalDuration);
          get().updateAchievementProgress('duration_10h', newTotalDuration);
          get().updateAchievementProgress('duration_100h', newTotalDuration);

          // Check streak
          get().checkStreak();
        },

        // Check streak
        checkStreak: () => {
          const { progression } = get();
          if (!progression) return;

          const now = new Date();
          const lastSession = progression.lastSessionDate ? new Date(progression.lastSessionDate) : null;

          if (!lastSession) {
            // First session
            set({
              progression: {
                ...progression,
                currentStreak: 1,
                longestStreak: 1,
              },
            }, false, 'checkStreak: first');
            get().updateAchievementProgress('streak_3', 1);
            return;
          }

          const daysDiff = Math.floor((now.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff === 0) {
            // Same day, no change
            return;
          } else if (daysDiff === 1) {
            // Next day, increment streak
            const newStreak = progression.currentStreak + 1;
            const longestStreak = Math.max(newStreak, progression.longestStreak);

            set({
              progression: {
                ...progression,
                currentStreak: newStreak,
                longestStreak,
              },
            }, false, 'checkStreak: increment');

            // Check streak achievements
            if (newStreak === 3) get().unlockAchievement('streak_3');
            if (newStreak === 7) get().unlockAchievement('streak_7');
            if (newStreak === 30) get().unlockAchievement('streak_30');
            if (newStreak === 100) get().unlockAchievement('streak_100');

            // Update progress
            get().updateAchievementProgress('streak_3', newStreak);
            get().updateAchievementProgress('streak_7', newStreak);
            get().updateAchievementProgress('streak_30', newStreak);
            get().updateAchievementProgress('streak_100', newStreak);
          } else {
            // Streak broken
            set({
              progression: {
                ...progression,
                currentStreak: 1,
              },
            }, false, 'checkStreak: reset');
          }
        },

        // Unlock achievement
        unlockAchievement: (achievementId) => {
          const { achievements } = get();
          const achievement = achievements.find((a) => a.id === achievementId);

          if (!achievement || achievement.unlockedAt) return;

          const now = new Date().toISOString();
          const updatedAchievements = achievements.map((a) =>
            a.id === achievementId ? { ...a, unlockedAt: now } : a
          );

          set({ achievements: updatedAchievements }, false, `unlockAchievement: ${achievementId}`);

          // Award points
          get().addPoints(achievement.points, `Achievement: ${achievement.name}`);
        },

        // Update achievement progress
        updateAchievementProgress: (achievementId, progress) => {
          const { achievements } = get();

          const updatedAchievements = achievements.map((a) => {
            if (a.id === achievementId && !a.unlockedAt && a.maxProgress) {
              const newProgress = Math.min(progress, a.maxProgress);
              return { ...a, progress: newProgress };
            }
            return a;
          });

          set({ achievements: updatedAchievements }, false, 'updateAchievementProgress');
        },

        // Add challenge
        addChallenge: (challenge) => {
          set((state) => ({
            activeChallenges: [...state.activeChallenges, challenge],
          }), false, 'addChallenge');
        },

        // Update challenge progress
        updateChallengeProgress: (challengeId, progress) => {
          const { activeChallenges } = get();

          const updatedChallenges = activeChallenges.map((c) => {
            if (c.id === challengeId) {
              const newProgress = Math.min(progress, c.goalValue);
              if (newProgress >= c.goalValue) {
                get().completeChallenge(challengeId);
              }
              return { ...c, currentProgress: newProgress };
            }
            return c;
          });

          set({ activeChallenges: updatedChallenges }, false, 'updateChallengeProgress');
        },

        // Complete challenge
        completeChallenge: (challengeId) => {
          const { activeChallenges } = get();
          const challenge = activeChallenges.find((c) => c.id === challengeId);

          if (!challenge) return;

          const now = new Date().toISOString();
          const completed = { ...challenge, completedAt: now };

          set((state) => ({
            activeChallenges: state.activeChallenges.filter((c) => c.id !== challengeId),
            completedChallenges: [...state.completedChallenges, completed],
          }), false, `completeChallenge: ${challengeId}`);

          get().addPoints(challenge.rewardPoints, `Challenge: ${challenge.name}`);
        },

        // Cleanup expired
        cleanupExpiredChallenges: () => {
          const now = new Date().toISOString();
          set((state) => ({
            activeChallenges: state.activeChallenges.filter((c) => c.expiresAt > now),
          }), false, 'cleanupExpiredChallenges');
        },

        // State management
        setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),
        setError: (error) => set({ error }, false, 'setError'),
        reset: () => set({ ...initialState, achievements: INITIAL_ACHIEVEMENTS }, false, 'reset'),
      }),
      {
        name: 'emotionscare-progression',
        partialize: (state) => ({
          progression: state.progression,
          achievements: state.achievements,
          activeChallenges: state.activeChallenges,
          completedChallenges: state.completedChallenges,
        }),
      }
    ),
    { name: 'ProgressionStore' }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const selectProgression = (s: ProgressionStore) => s.progression;
export const selectGlobalLevel = (s: ProgressionStore) => s.progression?.globalLevel || 1;
export const selectTotalPoints = (s: ProgressionStore) => s.progression?.totalPoints || 0;
export const selectCurrentStreak = (s: ProgressionStore) => s.progression?.currentStreak || 0;
export const selectUnlockedAchievements = (s: ProgressionStore) => s.achievements.filter((a) => a.unlockedAt);
export const selectLockedAchievements = (s: ProgressionStore) => s.achievements.filter((a) => !a.unlockedAt);
export const selectAchievementsByCategory = (category: Achievement['category']) =>
  (s: ProgressionStore) => s.achievements.filter((a) => a.category === category);
export const selectActiveChallenges = (s: ProgressionStore) => s.activeChallenges;
export const selectModuleProgress = (moduleId: string) =>
  (s: ProgressionStore) => s.progression?.moduleProgress[moduleId];
