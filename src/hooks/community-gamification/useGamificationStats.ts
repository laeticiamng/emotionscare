
import { useState, useEffect } from 'react';
import { GamificationStats } from './types';
import { mockGamificationStats } from './mockData';

export const useGamificationStats = () => {
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    rank: '0',
    badges: [],
    streak: 0,
    nextLevelPoints: 100,
    progress: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGamificationStats = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use mock data
        setStats(mockGamificationStats);
      } catch (error) {
        console.error('Error fetching gamification stats:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch gamification stats'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchGamificationStats();
  }, []);

  return { stats, isLoading, error };
};

export default useGamificationStats;
