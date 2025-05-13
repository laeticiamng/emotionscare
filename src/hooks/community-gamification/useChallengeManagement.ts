
import { useState, useCallback } from 'react';
import { Challenge } from '@/types/gamification';
import { completeChallenge as completeUserChallenge } from '@/lib/gamificationService';
import { v4 as uuidv4 } from 'uuid';

export function useChallengeManagement() {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([]);
  
  const generatePersonalizedChallenges = useCallback(async () => {
    // In a real implementation, this would call an API to get personalized challenges
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Set sample active challenges
    const sampleActiveChallenges: Challenge[] = [
      {
        id: uuidv4(),
        title: 'Journal quotidien',
        name: 'Journal quotidien', 
        description: 'Écrivez dans votre journal 5 jours consécutifs',
        points: 150,
        status: 'active',
        progress: 60,
        category: 'bien-être',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        title: 'Scan émotionnel',
        name: 'Scan émotionnel',
        description: 'Effectuez 3 scans émotionnels cette semaine',
        points: 100,
        status: 'active',
        progress: 33,
        category: 'connaissance de soi',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Set sample recommended challenges
    const sampleRecommendedChallenges: Challenge[] = [
      {
        id: uuidv4(),
        title: 'Méditation matinale',
        name: 'Méditation matinale',
        description: 'Méditez 5 minutes chaque matin pendant une semaine',
        points: 200,
        status: 'available',
        category: 'mindfulness',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        title: 'Gratitude quotidienne',
        name: 'Gratitude quotidienne',
        description: 'Notez 3 choses pour lesquelles vous êtes reconnaissant chaque jour',
        points: 150,
        status: 'available',
        category: 'gratitude',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    setActiveChallenges(sampleActiveChallenges);
    setRecommendedChallenges(sampleRecommendedChallenges);
    
  }, []);
  
  const acceptChallenge = useCallback(async (challengeId: string): Promise<boolean> => {
    // Find the challenge in recommended list
    const challenge = recommendedChallenges.find(c => c.id === challengeId);
    
    if (!challenge) return false;
    
    // In a real implementation, this would call an API to accept the challenge
    
    // Update local state
    const updatedChallenge: Challenge = {
      ...challenge,
      status: 'active',
      progress: 0
    };
    
    setRecommendedChallenges(prev => 
      prev.filter(c => c.id !== challengeId)
    );
    
    setActiveChallenges(prev => [...prev, updatedChallenge]);
    
    return true;
  }, [recommendedChallenges]);
  
  const completeChallenge = useCallback(async (challengeId: string): Promise<boolean> => {
    // Find the challenge in active list
    const challenge = activeChallenges.find(c => c.id === challengeId);
    
    if (!challenge) return false;
    
    try {
      // Call the API to complete the challenge
      const userId = 'current-user'; // This would normally come from auth context
      const success = await completeUserChallenge(userId, challengeId);
      
      if (success) {
        // Update local state
        setActiveChallenges(prev => 
          prev.map(c => 
            c.id === challengeId 
              ? { ...c, status: 'completed', progress: 100, completed: true } 
              : c
          )
        );
      }
      
      return success;
    } catch (error) {
      console.error('Error completing challenge:', error);
      return false;
    }
  }, [activeChallenges]);
  
  return {
    activeChallenges,
    recommendedChallenges,
    generatePersonalizedChallenges,
    acceptChallenge,
    completeChallenge
  };
}
