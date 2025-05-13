
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOpenAI } from '@/hooks/ai/useOpenAI';
import { UseCommunityGamificationResult } from './community-gamification/types';
import { useGamificationStats } from './community-gamification/useGamificationStats';
import { useChallengeManagement } from './community-gamification/useChallengeManagement';

/**
 * Hook to provide community gamification features
 */
export function useCommunityGamification(): UseCommunityGamificationResult {
  const { user } = useAuth();
  const { challenges: aiChallenges } = useOpenAI();
  
  const {
    stats, 
    isLoading, 
    loadGamificationStats,
    updateStatsForCompletedChallenge
  } = useGamificationStats();
  
  const {
    activeChallenges,
    recommendedChallenges,
    acceptChallenge,
    generatePersonalizedChallenges,
    completeChallenge: completeBasicChallenge
  } = useChallengeManagement();
  
  // Enhanced completeChallenge that also updates stats
  const completeChallenge = async (challengeId: string) => {
    const success = await completeBasicChallenge(challengeId);
    
    if (success) {
      updateStatsForCompletedChallenge(challengeId, activeChallenges);
    }
    
    return success;
  };
  
  // Initialize data loading
  useEffect(() => {
    if (user) {
      loadGamificationStats();
      generatePersonalizedChallenges();
    }
  }, [user, loadGamificationStats, generatePersonalizedChallenges]);
  
  return {
    stats,
    isLoading,
    activeChallenges,
    recommendedChallenges,
    generatePersonalizedChallenges,
    acceptChallenge,
    completeChallenge,
    refresh: loadGamificationStats
  };
}
