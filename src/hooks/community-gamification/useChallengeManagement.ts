
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Challenge } from '@/types/gamification';
import { UseChallengeManagementResult } from './types';
import { getEmotionBasedChallenges } from './mockData';

/**
 * Hook to manage community challenges
 */
export function useChallengeManagement(): UseChallengeManagementResult {
  const { toast } = useToast();
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([]);

  /**
   * Generate personalized challenges based on user emotion
   */
  const generatePersonalizedChallenges = useCallback(async (userEmotion?: string) => {
    try {
      const emotion = userEmotion || 'neutral';
      const challenges = getEmotionBasedChallenges(emotion);
      setRecommendedChallenges(challenges);
      return challenges;
    } catch (error) {
      console.error("Erreur lors de la génération des défis:", error);
      return [];
    }
  }, []);

  /**
   * Accept a challenge
   */
  const acceptChallenge = useCallback(async (challengeId: string) => {
    try {
      const challenge = [...activeChallenges, ...recommendedChallenges].find(c => c.id === challengeId);
      
      if (!challenge) {
        throw new Error("Défi non trouvé");
      }
      
      // In a real implementation, we would save this action to the database
      
      // Add the challenge to active challenges if it's not already there
      if (!activeChallenges.some(c => c.id === challengeId)) {
        setActiveChallenges(prev => [...prev, challenge]);
      }
      
      // Remove the challenge from recommendations
      setRecommendedChallenges(prev => prev.filter(c => c.id !== challengeId));
      
      toast({
        title: "Défi accepté",
        description: `Vous avez accepté le défi "${challenge.name}"`,
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'acceptation du défi:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter le défi",
        variant: "destructive"
      });
      return false;
    }
  }, [activeChallenges, recommendedChallenges, toast]);

  /**
   * Complete a challenge
   */
  const completeChallenge = useCallback(async (challengeId: string) => {
    try {
      // Update active challenges
      setActiveChallenges(prev => 
        prev.map(challenge => {
          if (challenge.id === challengeId) {
            return { ...challenge, completed: true, progress: challenge.total };
          }
          return challenge;
        })
      );
      
      toast({
        title: "Défi complété",
        description: "Félicitations ! Vous avez complété le défi avec succès !",
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la complétion du défi:", error);
      toast({
        title: "Erreur",
        description: "Impossible de compléter le défi",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  return {
    activeChallenges,
    recommendedChallenges,
    acceptChallenge,
    completeChallenge,
    generatePersonalizedChallenges
  };
}
