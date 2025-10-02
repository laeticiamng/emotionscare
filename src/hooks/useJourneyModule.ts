// @ts-nocheck
import { useCallback } from 'react';
import { useModuleProgress } from './useModuleProgress';

interface JourneyStage {
  id: string;
  name: string;
  points: number;
}

/**
 * Hook spécialisé pour les modules de type Journey/Parcours
 * (Breath Journey, VR Galaxy, Music Odyssey, etc.)
 */
export const useJourneyModule = (moduleName: string) => {
  const {
    progress,
    addPoints,
    incrementCompleted,
    incrementStreak,
    updateProgressData,
    unlockAchievement,
    startSession,
    endSession,
    isLoading
  } = useModuleProgress(moduleName);

  const completedStages = (progress?.progress_data?.completedStages || []) as string[];
  const currentStageIndex = progress?.progress_data?.currentStageIndex || 0;
  const totalPoints = progress?.total_points || 0;
  const level = progress?.level || 1;

  const completeStage = useCallback(async (
    stage: JourneyStage,
    sessionId: string | null,
    sessionStartTime: number,
    additionalData: Record<string, any> = {}
  ) => {
    // Update completed stages
    const newCompleted = [...completedStages, stage.id];
    await updateProgressData({
      completedStages: newCompleted,
      currentStageIndex: currentStageIndex + 1,
      ...additionalData
    });

    // Add points and increment
    await addPoints(stage.points);
    await incrementCompleted();
    await incrementStreak();

    // End session
    if (sessionId) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      await endSession(sessionId, stage.points, duration, true);
    }

    return newCompleted.length;
  }, [
    completedStages,
    currentStageIndex,
    addPoints,
    incrementCompleted,
    incrementStreak,
    updateProgressData,
    endSession
  ]);

  const unlockStage = useCallback(async (stageId: string) => {
    const unlockedStages = progress?.progress_data?.unlockedStages || [];
    if (!unlockedStages.includes(stageId)) {
      await updateProgressData({
        unlockedStages: [...unlockedStages, stageId]
      });
    }
  }, [progress, updateProgressData]);

  return {
    progress,
    completedStages,
    currentStageIndex,
    totalPoints,
    level,
    isLoading,
    completeStage,
    unlockStage,
    unlockAchievement,
    startSession,
    incrementStreak
  };
};
