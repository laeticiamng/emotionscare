// @ts-nocheck

import { useState } from 'react';
import { Badge } from '@/types/challenge';
import { updateChallenge, completeChallenge } from '@/lib/gamification/challenge-service';
import { logger } from '@/lib/logger';

export const useChallengeManagement = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastBadgeEarned, setLastBadgeEarned] = useState<Badge | null>(null);
  
  /**
   * Update challenge progress
   */
  const updateChallengeProgress = async (challengeId: string, progress: number): Promise<boolean> => {
    try {
      setIsUpdating(true);
      const result = await updateChallenge(challengeId, { progress });
      return result;
    } catch (error) {
      logger.error("Error updating challenge progress", error as Error, 'UI');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  /**
   * Complete a challenge
   */
  const completeChallengeAction = async (challengeId: string): Promise<boolean> => {
    try {
      setIsUpdating(true);
      const result = await completeChallenge(challengeId);
      
      if (result.success && result.badge) {
        setLastBadgeEarned(result.badge as unknown as Badge);
      }
      
      return result.success;
    } catch (error) {
      logger.error("Error completing challenge", error as Error, 'UI');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  /**
   * Clear the last earned badge notification
   */
  const clearLastBadgeEarned = () => {
    setLastBadgeEarned(null);
  };
  
  return {
    isUpdating,
    lastBadgeEarned,
    updateChallengeProgress,
    completeChallenge: completeChallengeAction,
    clearLastBadgeEarned
  };
};

export default useChallengeManagement;
