
import { useState, useCallback } from 'react';
import { Challenge } from '@/types/gamification';
import { completeChallenge as completeGamificationChallenge } from '@/lib/gamificationService';

export const useChallengeManagement = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([]);
  
  const markChallengeCompleted = useCallback(async (challengeId: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const updatedChallenge = await completeGamificationChallenge(challengeId);
      return updatedChallenge;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete challenge';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);
  
  const trackChallengeProgress = useCallback(async (challengeId: string, progress: number) => {
    // Implementation would update challenge progress
    console.log(`Tracking progress for challenge ${challengeId}: ${progress}`);
    return true;
  }, []);
  
  const acceptChallenge = useCallback(async (challengeId: string) => {
    console.log(`Accepting challenge ${challengeId}`);
    return true;
  }, []);
  
  const completeChallenge = useCallback(async (challengeId: string) => {
    try {
      await markChallengeCompleted(challengeId);
      return true;
    } catch (err) {
      return false;
    }
  }, [markChallengeCompleted]);
  
  const generatePersonalizedChallenges = useCallback(async () => {
    // Mock implementation - would fetch personalized challenges for user
    console.log('Generating personalized challenges');
  }, []);
  
  return {
    isProcessing,
    error,
    markChallengeCompleted,
    trackChallengeProgress,
    activeChallenges,
    recommendedChallenges,
    acceptChallenge,
    completeChallenge,
    generatePersonalizedChallenges
  };
};
