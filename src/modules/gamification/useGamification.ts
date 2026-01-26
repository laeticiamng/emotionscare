/**
 * Hook Gamification Unifié - EmotionsCare
 * Centralise toute la logique de gamification avec React Query
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { gamificationService } from './gamificationService';



const QUERY_KEYS = {
  progress: 'gamification-progress',
  rewards: 'gamification-rewards',
  challenges: 'gamification-challenges',
  achievements: 'gamification-achievements',
  leaderboard: 'gamification-leaderboard',
};

export function useGamification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? 'anonymous';

  // ========== QUERIES ==========

  // Progress
  const { 
    data: progress, 
    isLoading: progressLoading 
  } = useQuery({
    queryKey: [QUERY_KEYS.progress, userId],
    queryFn: () => gamificationService.getProgress(userId),
    enabled: !!userId,
    staleTime: 30000,
  });

  // Rewards
  const { 
    data: rewards = [], 
    isLoading: rewardsLoading 
  } = useQuery({
    queryKey: [QUERY_KEYS.rewards],
    queryFn: () => gamificationService.getRewards(),
    staleTime: 60000,
  });

  // Daily Challenges
  const { 
    data: dailyChallenges = [], 
    isLoading: challengesLoading 
  } = useQuery({
    queryKey: [QUERY_KEYS.challenges, userId],
    queryFn: () => gamificationService.getDailyChallenges(userId),
    enabled: !!userId,
    staleTime: 60000,
  });

  // Achievements
  const { 
    data: achievements = [], 
    isLoading: achievementsLoading 
  } = useQuery({
    queryKey: [QUERY_KEYS.achievements, userId],
    queryFn: () => gamificationService.getUserAchievements(userId),
    enabled: !!userId,
    staleTime: 60000,
  });

  // Leaderboard
  const {
    data: leaderboard = [],
    isLoading: leaderboardLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.leaderboard],
    queryFn: () => gamificationService.getLeaderboard(20),
    staleTime: 120000,
  });

  // ========== MUTATIONS ==========

  // Claim Reward
  const claimRewardMutation = useMutation({
    mutationFn: (rewardId: string) => gamificationService.claimReward(rewardId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.progress] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.rewards] });
    },
  });

  // Track Activity
  const trackActivityMutation = useMutation({
    mutationFn: ({ activityType, metadata }: { activityType: string; metadata?: Record<string, unknown> }) => 
      gamificationService.trackActivity(userId, activityType, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.progress] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.challenges] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.achievements] });
    },
  });

  // ========== ACTIONS ==========

  // Update Challenge Progress
  const updateChallengeProgress = useCallback((challengeId: string, increment?: number) => {
    const result = gamificationService.updateChallengeProgress(userId, challengeId, increment);
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.challenges] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.progress] });
    return result;
  }, [userId, queryClient]);

  // Update Achievement Progress
  const updateAchievementProgress = useCallback((achievementId: string, progress: number) => {
    const result = gamificationService.updateAchievementProgress(userId, achievementId, progress);
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.achievements] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.progress] });
    return result;
  }, [userId, queryClient]);

  // Update Streak
  const updateStreak = useCallback(async () => {
    const streak = await gamificationService.updateStreak(userId);
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.progress] });
    return streak;
  }, [userId, queryClient]);

  // Add Points
  const addPoints = useCallback(async (points: number) => {
    const result = await gamificationService.addPoints(userId, points);
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.progress] });
    return result;
  }, [userId, queryClient]);

  // Add XP
  const addXp = useCallback(async (xp: number) => {
    const result = await gamificationService.addXp(userId, xp);
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.progress] });
    return result;
  }, [userId, queryClient]);

  // Track Activity (convenience wrapper)
  const trackActivity = useCallback((activityType: string, metadata?: Record<string, unknown>) => {
    return trackActivityMutation.mutate({ activityType, metadata });
  }, [trackActivityMutation]);

  // ========== COMPUTED VALUES ==========

  // Claimed Rewards
  const claimedRewards = gamificationService.getClaimedRewards(userId);

  // Available rewards (not claimed yet)
  const availableRewards = rewards.filter(
    r => !claimedRewards.some(c => c.rewardId === r.id)
  );

  // Calculate time remaining for daily challenges
  const getTimeRemaining = useCallback(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  }, []);

  // Completed challenges count
  const completedChallengesCount = dailyChallenges.filter(c => c.completed).length;

  // Unlocked achievements count
  const unlockedAchievementsCount = achievements.filter(a => a.unlocked).length;

  // ========== RETURN ==========

  return {
    // Data
    progress,
    rewards: availableRewards,
    allRewards: rewards,
    claimedRewards,
    dailyChallenges,
    achievements,
    leaderboard,
    
    // Computed
    completedChallengesCount,
    unlockedAchievementsCount,
    
    // Loading states
    isLoading: progressLoading || rewardsLoading || challengesLoading || achievementsLoading,
    progressLoading,
    rewardsLoading,
    challengesLoading,
    achievementsLoading,
    leaderboardLoading,
    
    // Actions
    claimReward: claimRewardMutation.mutate,
    isClaimingReward: claimRewardMutation.isPending,
    updateChallengeProgress,
    updateAchievementProgress,
    updateStreak,
    addPoints,
    addXp,
    trackActivity,
    getTimeRemaining,
    
    // Refresh
    refreshProgress: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.progress] }),
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.progress] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.challenges] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.achievements] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.leaderboard] });
    },
  };
}

export default useGamification;
