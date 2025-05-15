
import { useState, useEffect } from 'react';
import { GamificationStats } from '@/types';

export const useGamificationStats = (userId?: string) => {
  const [stats, setStats] = useState<GamificationStats>({
    points: 850,
    level: 3,
    badges: [],
    streak: 5,
    completedChallenges: 4,
    totalChallenges: 10,
    rank: '42',
    activeChallenges: 6,
    streakDays: 5,
    nextLevelPoints: 150,
    progressToNextLevel: 70,
    badgesCount: 12,
    nextLevel: {
      points: 1000,
      rewards: ['Badge Spécial', 'Points bonus']
    },
    lastActivityDate: new Date().toISOString()
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
