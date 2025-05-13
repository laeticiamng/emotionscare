
import { useState, useCallback } from 'react';
import { Badge, Challenge, GamificationStats } from '@/types/gamification';

export const useGamificationStats = () => {
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
  
  const [isLoading, setIsLoading] = useState(false);
  
  const loadGamificationStats = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data loading
      const mockStats: GamificationStats = {
        points: 450,
        level: 3,
        nextLevelPoints: 600,
        badges: [],
        completedChallenges: 7,
        activeChallenges: 3,
        streakDays: 5,
        progressToNextLevel: 75,
        totalPoints: 450,
        currentLevel: 3,
        badgesCount: 5,
        pointsToNextLevel: 150,
        lastActivityDate: new Date().toISOString(),
        challenges: [],
        recentAchievements: []
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading gamification stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const updateStatsForCompletedChallenge = useCallback((challengeId: string, challenges: Challenge[]) => {
    // Find the challenge in the list
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!challenge) return;
    
    setStats(prevStats => ({
      ...prevStats,
      completedChallenges: prevStats.completedChallenges + 1,
      points: prevStats.points + (challenge.points || 0),
      totalPoints: (prevStats.totalPoints || prevStats.points) + (challenge.points || 0)
    }));
  }, []);
  
  return {
    stats,
    isLoading,
    loadGamificationStats,
    updateStatsForCompletedChallenge
  };
};
