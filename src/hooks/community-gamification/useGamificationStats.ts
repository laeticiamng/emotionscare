import { useState, useEffect } from 'react';
import { GamificationStats } from '@/types';

export const useGamificationStats = (userId?: string) => {
  const [stats, setStats] = useState<GamificationStats>({
    points: 450,
    level: 3,
    progress: 65,  // Add missing required properties
    badges: [],
    challenges: [],
    achievements: [],
    leaderboard: [],
    streak: 5,
    nextLevelPoints: 500,
    completedChallenges: 8,
    totalChallenges: 12,
    rank: 'Silver',
    activeChallenges: 4,
    streakDays: 5,
    pointsToNextLevel: 50,
    progressToNextLevel: 65,
    badgesCount: 12,
    nextLevel: {
      points: 500,
      rewards: ['New Badge', 'Feature Unlock']
    },
    lastActivityDate: '2023-05-01'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, we would fetch from API using userId
        // For now, just using mock data set in initial state
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch gamification stats'));
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [userId]);
  
  return {
    stats,
    loading,
    error
  };
};

export default useGamificationStats;
