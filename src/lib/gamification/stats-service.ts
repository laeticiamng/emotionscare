
import { GamificationStats } from '@/types/gamification';

export const getGamificationStats = async (userId: string): Promise<GamificationStats> => {
  // Mock implementation
  return {
    level: 3,
    points: 450,
    nextLevelPoints: 600,
    badges: [],
    completedChallenges: 7,
    activeChallenges: 3,
    streakDays: 5,
    progressToNextLevel: 75,
    currentLevel: 3,
    totalPoints: 450,
    pointsToNextLevel: 150,
    badgesCount: 5,
    lastActivityDate: new Date().toISOString(),
    challenges: [],
    recentAchievements: []
  };
};

// Added this function
export const getUserStats = getGamificationStats;
