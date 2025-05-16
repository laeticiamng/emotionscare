
import { useState, useEffect, useCallback } from 'react';
import { GamificationStats, Badge, Challenge } from '@/types/gamification';
import { UseGamificationReturn } from '@/types/hooks';

export const useGamification = (): UseGamificationReturn => {
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    badges: [],
    completedChallenges: 0,
    totalChallenges: 0,
    challenges: [],
    streak: 0,
    progress: 0,
    leaderboard: [],
    currentLevel: 1,
    nextLevel: {
      points: 100,
      rewards: [],
      level: 2
    },
    pointsToNextLevel: 100,
    progressToNextLevel: 0
  });
  
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock fetch gamification data
  const fetchGamificationStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock badges data
      const mockBadges: Badge[] = [
        {
          id: '1',
          name: 'Early Adopter',
          description: 'Joined during the beta phase',
          imageUrl: '/images/badges/early-adopter.png',
          category: 'progress',
          tier: 'bronze',
          completed: true
        },
        {
          id: '2',
          name: 'Emotion Explorer',
          description: 'Recorded 10 different emotions',
          imageUrl: '/images/badges/emotion-explorer.png',
          category: 'activity',
          tier: 'silver',
          completed: false
        },
        {
          id: '3',
          name: 'Journaling Pro',
          description: 'Created 30 journal entries',
          imageUrl: '/images/badges/journaling-pro.png',
          category: 'journal',
          tier: 'gold',
          completed: false
        }
      ];
      
      // Mock challenges data
      const mockChallenges: Challenge[] = [
        {
          id: '1',
          title: 'Daily Check-in',
          name: 'Daily Check-in',
          description: 'Record your emotion every day for a week',
          points: 50,
          category: 'daily',
          status: 'active',
          progress: 3,
          total: 7,
          completed: false
        },
        {
          id: '2',
          title: 'Journal Journey',
          name: 'Journal Journey',
          description: 'Write 5 journal entries',
          points: 100,
          category: 'weekly',
          status: 'active',
          progress: 2,
          total: 5,
          completed: false
        },
        {
          id: '3',
          title: 'VR Explorer',
          name: 'VR Explorer',
          description: 'Complete 3 different VR sessions',
          points: 150,
          category: 'special',
          status: 'active',
          progress: 0,
          total: 3,
          completed: false
        }
      ];
      
      // Set the mock data
      setStats({
        points: 250,
        level: 3,
        badges: mockBadges,
        completedChallenges: 2,
        totalChallenges: 5,
        challenges: mockChallenges,
        streak: 3,
        currentLevel: 3,
        nextLevel: {
          points: 400,
          rewards: ['Badge exclusive', 'New theme'],
          level: 4
        },
        pointsToNextLevel: 150,
        progressToNextLevel: 65,
        totalPoints: 250,
        badgesCount: mockBadges.length,
        streakDays: 3,
        lastActivityDate: new Date().toISOString(),
        activeChallenges: 3,
        progress: 65,
        leaderboard: []
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
          return { ...c, status: 'completed', completed: true, progress: c.total || 100 };
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
    completeChallenge
  };
};

export default useGamification;
