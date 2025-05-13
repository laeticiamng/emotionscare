
import { GamificationStats } from '@/types/gamification';

export const getGamificationStats = async (userId: string): Promise<GamificationStats> => {
  // Mock implementation
  return {
    level: 3,
    points: 450,
    nextLevelPoints: 600,
    badges: [],
    challengesCompleted: 7,
    streak: 5,
    currentLevel: 3,
    totalPoints: 450,
    pointsToNextLevel: 150,
    progressToNextLevel: 75,
    badgesCount: 5,
    streakDays: 5,
    lastActivityDate: new Date().toISOString(),
    activeChallenges: 3,
    completedChallenges: 7
  };
};
