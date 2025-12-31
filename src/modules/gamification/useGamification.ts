/**
 * Hook Gamification - EmotionsCare
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { gamificationService } from './gamificationService';
import type { 
  Reward, 
  DailyChallenge, 
  GamificationProgress, 
  Achievement 
} from './types';

const QUERY_KEYS = {
  progress: 'gamification-progress',
  rewards: 'gamification-rewards',
  challenges: 'gamification-challenges',
  achievements: 'gamification-achievements',
};

export function useGamification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? 'anonymous';

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

  // Claim Reward Mutation
  const claimRewardMutation = useMutation({
    mutationFn: (rewardId: string) => gamificationService.claimReward(rewardId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.progress] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.rewards] });
    },
  });

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

  return {
    // Data
    progress,
    rewards: availableRewards,
    allRewards: rewards,
    claimedRewards,
    dailyChallenges,
    achievements,
    
    // Loading states
    isLoading: progressLoading || rewardsLoading || challengesLoading || achievementsLoading,
    progressLoading,
    rewardsLoading,
    challengesLoading,
    achievementsLoading,
    
    // Actions
    claimReward: claimRewardMutation.mutate,
    isClaimingReward: claimRewardMutation.isPending,
    updateChallengeProgress,
    updateAchievementProgress,
    updateStreak,
    getTimeRemaining,
  };
}

export default useGamification;
