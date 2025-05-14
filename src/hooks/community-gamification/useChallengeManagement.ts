
import { useState } from 'react';
import { completeChallenge } from '@/lib/gamificationService';
import { Challenge } from './types';

export const useChallengeManagement = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const markChallengeAsComplete = async (challengeId: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      await completeChallenge(challengeId);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur s'est produite";
      setError(errorMessage);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const updateChallengeProgress = (challenge: Challenge, progress: number) => {
    // Dans une implémentation réelle, cette fonction mettrait à jour la progression
    // dans une base de données ou un service externe
    console.log(`Challenge ${challenge.id} progress updated to ${progress}`);
    return {
      ...challenge,
      progress
    };
  };

  return {
    markChallengeAsComplete,
    updateChallengeProgress,
    isProcessing,
    error
  };
};

export default useChallengeManagement;
