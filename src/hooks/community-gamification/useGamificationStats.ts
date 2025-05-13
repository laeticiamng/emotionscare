
import { useState, useCallback } from 'react';
import { GamificationStats } from './types';
import { Badge, Challenge } from '@/types/gamification';
import { getUserGamificationStats } from '@/lib/gamificationService';

export function useGamificationStats() {
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    nextLevelPoints: 100,
    badges: [],
    completedChallenges: 0,
    activeChallenges: 0,
    streakDays: 0,
    progressToNextLevel: 0,
    totalPoints: 0,
    currentLevel: 1,
    badgesCount: 0,
    pointsToNextLevel: 100,
    lastActivityDate: null,
    challenges: [],
    recentAchievements: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  const loadGamificationStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const userId = 'current-user'; // This would normally come from auth context
      const userStats = await getUserGamificationStats(userId);
      
      setStats({
        ...userStats,
        challenges: userStats.challenges || [],
        recentAchievements: userStats.recentAchievements || []
      });
    } catch (error) {
      console.error('Error loading gamification stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const updateStatsForCompletedChallenge = useCallback(
    (challengeId: string, activeChallenges: Challenge[]) => {
      const challenge = activeChallenges.find(c => c.id === challengeId);
      
      if (!challenge) return;
      
      setStats(prevStats => {
        const pointsEarned = challenge.points || 0;
        const newTotalPoints = (prevStats.totalPoints || prevStats.points) + pointsEarned;
        const newLevel = Math.floor(Math.sqrt(newTotalPoints / 100)) + 1;
        const nextLevelPoints = (newLevel + 1) * (newLevel + 1) * 100;
        const pointsToNext = nextLevelPoints - newTotalPoints;
        const progress = Math.floor((newTotalPoints / nextLevelPoints) * 100);
        
        return {
          ...prevStats,
          points: newTotalPoints,
          totalPoints: newTotalPoints,
          level: newLevel,
          currentLevel: newLevel,
          nextLevelPoints,
          pointsToNextLevel: pointsToNext,
          progressToNextLevel: progress,
          completedChallenges: prevStats.completedChallenges + 1,
          challenges: prevStats.challenges.map(c => 
            c.id === challengeId ? { ...c, status: 'completed' as const, completed: true } : c
          )
        };
      });
    }, []
  );
  
  // Initialize data on first render
  useCallback(() => {
    loadGamificationStats();
  }, [loadGamificationStats]);
  
  return {
    stats,
    isLoading,
    loadGamificationStats,
    updateStatsForCompletedChallenge
  };
}
