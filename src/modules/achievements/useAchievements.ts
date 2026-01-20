/**
 * Hook useAchievements
 * Gestion des achievements avec React Query
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { achievementsService } from './achievementsService';
import type { Achievement, AchievementStats, UserAchievementProgress, UserBadge, RecordProgress } from './types';
import { toast } from 'sonner';

const QUERY_KEYS = {
  all: ['achievements'],
  list: () => [...QUERY_KEYS.all, 'list'],
  progress: (userId: string) => [...QUERY_KEYS.all, 'progress', userId],
  unlocked: (userId: string) => [...QUERY_KEYS.all, 'unlocked', userId],
  stats: (userId: string) => [...QUERY_KEYS.all, 'stats', userId],
  badges: (userId: string) => [...QUERY_KEYS.all, 'badges', userId],
  unnotified: (userId: string) => [...QUERY_KEYS.all, 'unnotified', userId],
};

export interface UseAchievementsReturn {
  // Data
  achievements: Achievement[];
  userProgress: UserAchievementProgress[];
  unlockedAchievements: UserAchievementProgress[];
  stats: AchievementStats | null;
  badges: UserBadge[];
  unnotifiedCount: number;
  
  // State
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Actions
  recordProgress: (progress: RecordProgress) => Promise<UserAchievementProgress>;
  markAsNotified: (achievementIds: string[]) => Promise<void>;
  refreshAchievements: () => Promise<void>;
  
  // Helpers
  getAchievementById: (id: string) => Achievement | undefined;
  getProgressForAchievement: (achievementId: string) => UserAchievementProgress | undefined;
  isUnlocked: (achievementId: string) => boolean;
}

export function useAchievements(): UseAchievementsReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || '';

  // Query: All achievements
  const {
    data: achievements = [],
    isLoading: isLoadingAchievements,
    isError: isErrorAchievements,
    error: errorAchievements,
  } = useQuery({
    queryKey: QUERY_KEYS.list(),
    queryFn: () => achievementsService.getAllAchievements(false),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Query: User progress
  const {
    data: userProgress = [],
    isLoading: isLoadingProgress,
  } = useQuery({
    queryKey: QUERY_KEYS.progress(userId),
    queryFn: () => achievementsService.getUserProgress(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Query: Unlocked achievements
  const {
    data: unlockedAchievements = [],
    isLoading: isLoadingUnlocked,
  } = useQuery({
    queryKey: QUERY_KEYS.unlocked(userId),
    queryFn: () => achievementsService.getUnlockedAchievements(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  // Query: Stats
  const {
    data: stats,
    isLoading: isLoadingStats,
  } = useQuery({
    queryKey: QUERY_KEYS.stats(userId),
    queryFn: () => achievementsService.getUserStats(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // Query: Badges
  const {
    data: badges = [],
    isLoading: isLoadingBadges,
  } = useQuery({
    queryKey: QUERY_KEYS.badges(userId),
    queryFn: () => achievementsService.getUserBadges(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // Query: Unnotified achievements
  const {
    data: unnotifiedAchievements = [],
  } = useQuery({
    queryKey: QUERY_KEYS.unnotified(userId),
    queryFn: () => achievementsService.getUnnotifiedAchievements(userId),
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Mutation: Record progress
  const recordProgressMutation = useMutation({
    mutationFn: (progress: RecordProgress) => 
      achievementsService.recordProgress(userId, progress),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.progress(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unlocked(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unnotified(userId) });

      // Show toast if unlocked
      if (data.unlocked) {
        const achievement = achievements.find(a => a.id === data.achievement_id);
        if (achievement) {
          toast.success(`🏆 ${achievement.name} débloqué !`, {
            description: achievement.description,
          });
        }
      }
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'enregistrement de la progression');
    },
  });

  // Mutation: Mark as notified
  const markAsNotifiedMutation = useMutation({
    mutationFn: (achievementIds: string[]) => 
      achievementsService.markAsNotified(userId, achievementIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unnotified(userId) });
    },
  });

  // Actions
  const recordProgress = useCallback(
    (progress: RecordProgress) => recordProgressMutation.mutateAsync(progress),
    [recordProgressMutation]
  );

  const markAsNotified = useCallback(
    (achievementIds: string[]) => markAsNotifiedMutation.mutateAsync(achievementIds),
    [markAsNotifiedMutation]
  );

  const refreshAchievements = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
  }, [queryClient]);

  // Helpers
  const getAchievementById = useCallback(
    (id: string) => achievements.find(a => a.id === id),
    [achievements]
  );

  const getProgressForAchievement = useCallback(
    (achievementId: string) => userProgress.find(p => p.achievement_id === achievementId),
    [userProgress]
  );

  const isUnlocked = useCallback(
    (achievementId: string) => unlockedAchievements.some(p => p.achievement_id === achievementId),
    [unlockedAchievements]
  );

  // Combined loading state
  const isLoading = isLoadingAchievements || isLoadingProgress || isLoadingUnlocked || isLoadingStats || isLoadingBadges;
  const isError = isErrorAchievements;
  const error = errorAchievements as Error | null;

  return {
    achievements,
    userProgress,
    unlockedAchievements,
    stats: stats || null,
    badges,
    unnotifiedCount: unnotifiedAchievements.length,
    isLoading,
    isError,
    error,
    recordProgress,
    markAsNotified,
    refreshAchievements,
    getAchievementById,
    getProgressForAchievement,
    isUnlocked,
  };
}

export default useAchievements;
