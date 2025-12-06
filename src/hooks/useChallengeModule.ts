// @ts-nocheck
import { useCallback } from 'react';
import { useModuleProgress } from './useModuleProgress';

interface Challenge {
  id: string;
  name: string;
  points: number;
}

/**
 * Hook spécialisé pour les modules de type Challenge/Battle
 * (Flash Glow, Boss Grit, Bubble Beat, etc.)
 */
export const useChallengeModule = (moduleName: string) => {
  const {
    progress,
    addPoints,
    incrementCompleted,
    incrementStreak,
    resetStreak,
    updateProgressData,
    unlockAchievement,
    startSession,
    endSession,
    isLoading
  } = useModuleProgress(moduleName);

  const completedChallenges = (progress?.progress_data?.completed || []) as string[];
  const totalPoints = progress?.total_points || 0;
  const streak = progress?.streak || 0;
  const bestStreak = progress?.progress_data?.bestStreak || 0;
  const currentIndex = progress?.progress_data?.currentIndex || 0;

  const completeChallenge = useCallback(async (
    challenge: Challenge,
    sessionId: string | null,
    sessionStartTime: number,
    performanceData: Record<string, any> = {}
  ) => {
    // Update completed list
    const newCompleted = [...completedChallenges, challenge.id];
    const newBestStreak = Math.max(bestStreak, streak + 1);
    
    await updateProgressData({
      completed: newCompleted,
      currentIndex: currentIndex + 1,
      bestStreak: newBestStreak,
      ...performanceData
    });

    // Add points and streaks
    await addPoints(challenge.points);
    await incrementStreak();
    await incrementCompleted();

    // End session
    if (sessionId) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      await endSession(sessionId, challenge.points, duration, true);
    }

    return {
      totalCompleted: newCompleted.length,
      newStreak: streak + 1,
      newBestStreak
    };
  }, [
    completedChallenges,
    currentIndex,
    bestStreak,
    streak,
    addPoints,
    incrementStreak,
    incrementCompleted,
    updateProgressData,
    endSession
  ]);

  const failChallenge = useCallback(async () => {
    await resetStreak();
  }, [resetStreak]);

  return {
    progress,
    completedChallenges,
    totalPoints,
    streak,
    bestStreak,
    currentIndex,
    isLoading,
    completeChallenge,
    failChallenge,
    unlockAchievement,
    startSession,
    resetStreak
  };
};
