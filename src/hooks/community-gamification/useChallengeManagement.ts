
import { useState, useEffect } from 'react';
import { Challenge } from '@/types/gamification';
import { fetchChallenges } from '@/lib/gamificationService';

export const useChallengeManagement = (userId: string) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChallenges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchChallenges(userId, 'all');
      setChallenges(data);
      
      // Filter challenges into active and completed
      setActiveChallenges(data.filter(c => c.status === 'active' || c.status === 'ongoing' || c.status === 'available'));
      setCompletedChallenges(data.filter(c => c.status === 'completed'));
    } catch (err) {
      setError('Failed to load challenges');
      console.error('Error loading challenges:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [userId]);

  const joinChallenge = async (challengeId: string) => {
    // Here would be API call to join a challenge
    console.log('Joining challenge:', challengeId);
    // Reload challenges after joining
    await loadChallenges();
    return true;
  };

  const completeChallenge = async (challengeId: string) => {
    // Here would be API call to mark challenge as complete
    console.log('Completing challenge:', challengeId);
    // Reload challenges after completion
    await loadChallenges();
    return true;
  };

  return {
    challenges,
    activeChallenges,
    completedChallenges,
    isLoading,
    error,
    joinChallenge,
    completeChallenge,
    refreshChallenges: loadChallenges
  };
};
