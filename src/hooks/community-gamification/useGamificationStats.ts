
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GamificationStats } from './types';
import { generateMockGamificationStats } from './mockData';
import { Challenge } from '@/types/gamification';

/**
 * Hook to manage gamification stats
 */
export function useGamificationStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Load gamification stats for the current user
   */
  const loadGamificationStats = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, we would load this data from the database
      // For this demo, we're simulating data
      const mockStats = generateMockGamificationStats(user.id);
      setStats(mockStats);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Update stats when a challenge is completed
   */
  const updateStatsForCompletedChallenge = useCallback((challengeId: string, challenges: Challenge[]) => {
    if (!stats) return;

    const challenge = challenges.find(c => c.id === challengeId);
    const points = challenge?.points || 50;
    
    const newAchievement = {
      type: 'challenge' as const,
      id: challengeId,
      name: challenge?.name || 'Défi complété',
      timestamp: new Date(),
      points
    };
    
    setStats({
      ...stats,
      points: stats.points + points,
      recentAchievements: [newAchievement, ...stats.recentAchievements]
    });
  }, [stats]);

  return {
    stats,
    isLoading,
    loadGamificationStats,
    updateStatsForCompletedChallenge
  };
}
