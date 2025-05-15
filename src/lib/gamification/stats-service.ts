
import { GamificationStats } from '@/types/gamification';

export const getGamificationStats = async (userId: string): Promise<GamificationStats> => {
  // This would normally fetch data from an API
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  return {
    points: 530,
    level: 5,
    rank: "Emotional Explorer",
    badges: [], // This would typically contain badge objects
    streak: 7,
    completedChallenges: 12,
    totalChallenges: 15, // Ajout de la propriété manquante
    activeChallenges: 3,
    streakDays: 7,
    nextLevelPoints: 1000,
    progressToNextLevel: 53,
    totalPoints: 530,
    badgesCount: 8,
    challenges: [],
    recentAchievements: [],
    nextLevel: {
      points: 1000,
      rewards: ["New Badge", "Meditation Access"]
    },
    achievements: [],
    currentLevel: 5,
    pointsToNextLevel: 470,
    lastActivityDate: new Date().toISOString()
  };
};
