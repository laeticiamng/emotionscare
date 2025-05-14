
import { useState, useEffect } from 'react';
import { GamificationStats } from '@/types/gamification';
import { fetchGamificationStats, syncGamificationData } from '@/lib/gamificationService';

export const useGamificationStats = (userId: string) => {
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    nextLevelPoints: 100,
    badges: [],
    completedChallenges: 0,
    activeChallenges: 0,
    streakDays: 0,
    progressToNextLevel: 0,
    challenges: [],
    recentAchievements: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const loadStats = async () => {
    if (!userId) {
      setError("User ID is required");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchGamificationStats(userId);
      
      if (data) {
        setStats({
          ...data,
          progressToNextLevel: calculateProgress(data.points, data.nextLevelPoints)
        });
      }
      
      setLastSynced(new Date());
    } catch (err) {
      setError("Failed to load gamification stats");
      console.error('Error loading gamification stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const syncStats = async () => {
    if (!userId) return;
    
    try {
      const syncResult = await syncGamificationData(userId);
      if (syncResult) {
        await loadStats();
      }
    } catch (err) {
      console.error('Error syncing gamification data:', err);
    }
  };

  const calculateProgress = (current: number, target: number): number => {
    if (target <= 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId]);

  return {
    stats,
    isLoading,
    error,
    lastSynced,
    refreshStats: loadStats,
    syncStats
  };
};

export default useGamificationStats;
