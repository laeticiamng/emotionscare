
import { useState, useCallback } from 'react';
import { Challenge } from './types';
import { completeChallenge } from '@/lib/gamificationService';

export const useChallengeManagement = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const markChallengeCompleted = useCallback(async (challengeId: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const updatedChallenge = await completeChallenge(challengeId);
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
  
  return {
    isProcessing,
    error,
    markChallengeCompleted,
    trackChallengeProgress
  };
};
