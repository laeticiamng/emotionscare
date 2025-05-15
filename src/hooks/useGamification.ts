
import { useState, useEffect, useCallback } from 'react';
import { GamificationStats, Badge, Challenge } from '@/types/types';

interface UseGamificationReturn {
  stats: GamificationStats;
  badges: Badge[];
  challenges: Challenge[];
  isLoading: boolean;
  error: string;
  fetchGamificationStats: () => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<boolean>;
}

export const useGamification = (): UseGamificationReturn => {
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    badges: [],
    completedChallenges: 0,
    totalChallenges: 0,
    streak: 0,
    currentLevel: 1,
    nextLevel: 2,
    pointsToNextLevel: 100,
    progressToNextLevel: 0,
    activeChallenges: 0,
    rank: 'Beginner'
  });
  
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock fetch gamification data
  const fetchGamificationStats = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock badges data
      const mockBadges: Badge[] = [
        {
          id: '1',
          name: 'Early Adopter',
          description: 'Joined during the beta phase',
          icon: 'star',
          imageUrl: '/images/badges/early-adopter.png',
        },
        {
          id: '2',
          name: 'Emotion Explorer',
          description: 'Recorded 10 different emotions',
          icon: 'heart',
          imageUrl: '/images/badges/emotion-explorer.png',
        },
        {
          id: '3',
          name: 'Journaling Pro',
          description: 'Created 30 journal entries',
          icon: 'book',
          imageUrl: '/images/badges/journaling-pro.png',
        }
      ];
      
      // Mock challenges data
      const mockChallenges: Challenge[] = [
        {
          id: '1',
          name: 'Daily Check-in',
          title: 'Daily Check-in',
          description: 'Record your emotion every day for a week',
          points: 50,
          type: 'streak',
          category: 'emotion',
          status: 'in-progress',
          progress: 3,
          total: 7,
          completions: 0
        },
        {
          id: '2',
          name: 'Journal Journey',
          title: 'Journal Journey',
          description: 'Write 5 journal entries',
          points: 100,
          type: 'count',
          category: 'journal',
          status: 'in-progress',
          progress: 2,
          total: 5,
          completions: 0
        },
        {
          id: '3',
          name: 'VR Explorer',
          title: 'VR Explorer',
          description: 'Complete 3 different VR sessions',
          points: 150,
          type: 'count',
          category: 'vr',
          status: 'not-started',
          progress: 0,
          total: 3,
          completions: 0
        }
      ];
      
      // Set the mock data
      setStats({
        points: 250,
        level: 3,
        rank: 'Explorer',
        badges: mockBadges,
        completedChallenges: 2,
        totalChallenges: 5,
        streak: 3,
        currentLevel: 3,
        nextLevel: 4,
        pointsToNextLevel: 150,
        progressToNextLevel: 65,
        activeChallenges: 3,
        streakDays: 3,
        lastActivityDate: new Date().toISOString(),
        badgesCount: mockBadges.length
      });
      
      setBadges(mockBadges);
      setChallenges(mockChallenges);
    } catch (err) {
      setError('Failed to fetch gamification data');
      console.error('Error fetching gamification data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simulate completing a challenge
  const completeChallenge = useCallback(async (challengeId: string): Promise<boolean> => {
    try {
      // Find the challenge to complete
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return false;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update challenges list
      setChallenges(prev => prev.map(c => {
        if (c.id === challengeId) {
          return { ...c, status: 'completed', completed: true, progress: c.total || 0 };
        }
        return c;
      }));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        points: prev.points + challenge.points,
        completedChallenges: prev.completedChallenges + 1,
        activeChallenges: prev.activeChallenges ? prev.activeChallenges - 1 : 0
      }));
      
      return true;
    } catch (error) {
      console.error('Error completing challenge:', error);
      return false;
    }
  }, [challenges]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchGamificationStats();
  }, [fetchGamificationStats]);

  return {
    stats,
    badges,
    challenges,
    isLoading,
    error,
    fetchGamificationStats,
    completeChallenge
  };
};

export default useGamification;
