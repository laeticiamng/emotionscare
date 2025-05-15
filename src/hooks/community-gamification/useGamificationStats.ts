
import { useState, useEffect, useCallback } from 'react';
import { GamificationStats, Badge } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useGamificationStats = (userId: string | undefined) => {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchStats = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // This would call an actual API in a real app
      // For demo purposes, we'll return mock data
      const mockStats: GamificationStats = {
        points: 1250,
        level: 4,
        badges: [
          {
            id: '1',
            name: 'First Emotion',
            description: 'Complete your first emotion scan',
            icon: 'smile',
            type: 'achievement',
            level: 1
          },
          {
            id: '2',
            name: 'Consistent',
            description: 'Log in for 5 consecutive days',
            icon: 'calendar',
            type: 'streak',
            level: 2
          }
        ] as Badge[],
        rank: 'Explorer',
        streak: 5,
        completedChallenges: 7,
        totalChallenges: 12,
        challenges: [],
        nextLevel: 5,
        pointsToNextLevel: 500,
        progressToNextLevel: 60,
        streakDays: 5,
        lastActivityDate: new Date().toISOString(),
        activeChallenges: 3,
        leaderboard: []
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStats(mockStats);
    } catch (err) {
      console.error('Error fetching gamification stats:', err);
      setError('Failed to load gamification statistics');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchStats
  };
};

export default useGamificationStats;
