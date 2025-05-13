
import { GamificationLevel, GamificationStats } from '@/types/gamification';
import { mockChallenges, mockBadges } from '@/hooks/community-gamification/mockData';

export const gamificationLevels: GamificationLevel[] = [
  { level: 1, pointsRequired: 0, title: "Débutant", benefits: ["Accès aux défis de base"] },
  { level: 2, pointsRequired: 100, title: "Apprenti", benefits: ["Accès aux défis intermédiaires"] },
  { level: 3, pointsRequired: 250, title: "Intermédiaire", benefits: ["Accès aux défis avancés"] },
  { level: 4, pointsRequired: 500, title: "Avancé", benefits: ["Badge visible dans le profil"] },
  { level: 5, pointsRequired: 1000, title: "Expert", benefits: ["Déblocage de méditation guidée personnalisée"] },
  { level: 6, pointsRequired: 2000, title: "Maître", benefits: ["Déblocage de l'analyse émotionnelle avancée"] },
  { level: 7, pointsRequired: 3500, title: "Grand Maître", benefits: ["Accès au mode coach personnalisé"] },
  { level: 8, pointsRequired: 5000, title: "Légende", benefits: ["Récompenses exclusives"] },
  { level: 9, pointsRequired: 7500, title: "Champion", benefits: ["Accès aux bêtas des nouvelles fonctionnalités"] },
  { level: 10, pointsRequired: 10000, title: "Éclairé", benefits: ["Accès VIP complet"] }
];

/**
 * Calculate user's level based on total points
 */
export const calculateLevel = (points: number): number => {
  for (let i = gamificationLevels.length - 1; i >= 0; i--) {
    if (points >= gamificationLevels[i].pointsRequired) {
      return gamificationLevels[i].level;
    }
  }
  return 1; // Default level
};

/**
 * Calculate points required for the next level
 */
export const getNextLevelPoints = (currentLevel: number): number => {
  const nextLevelIndex = gamificationLevels.findIndex(level => level.level === currentLevel + 1);
  
  if (nextLevelIndex === -1) {
    // Max level reached
    return gamificationLevels[gamificationLevels.length - 1].pointsRequired;
  }
  
  return gamificationLevels[nextLevelIndex].pointsRequired;
};

/**
 * Calculate progress percentage to the next level
 */
export const calculateProgressToNextLevel = (points: number): number => {
  const currentLevel = calculateLevel(points);
  const currentLevelIndex = gamificationLevels.findIndex(level => level.level === currentLevel);
  const currentLevelPoints = gamificationLevels[currentLevelIndex].pointsRequired;
  
  const nextLevelIndex = currentLevelIndex + 1;
  
  if (nextLevelIndex >= gamificationLevels.length) {
    // Max level reached
    return 100;
  }
  
  const nextLevelPoints = gamificationLevels[nextLevelIndex].pointsRequired;
  const pointsForCurrentLevel = points - currentLevelPoints;
  const pointsRequiredForNextLevel = nextLevelPoints - currentLevelPoints;
  
  return Math.round((pointsForCurrentLevel / pointsRequiredForNextLevel) * 100);
};

/**
 * Award points to a user and return updated stats
 */
export const awardPoints = async (userId: string, points: number): Promise<GamificationStats> => {
  // Get current stats
  const currentStats = await getUserStats(userId);
  
  // Update points
  const updatedPoints = currentStats.points + points;
  const level = calculateLevel(updatedPoints);
  const nextLevelPoints = getNextLevelPoints(level);
  const progressToNextLevel = calculateProgressToNextLevel(updatedPoints);
  
  // Update stats
  const updatedStats: GamificationStats = {
    ...currentStats,
    points: updatedPoints,
    level,
    nextLevelPoints,
    progressToNextLevel,
    totalPoints: updatedPoints,
    currentLevel: level,
    pointsToNextLevel: nextLevelPoints - updatedPoints
  };
  
  // Save updated stats (in a real app)
  // await saveUserStats(userId, updatedStats);
  
  return updatedStats;
};

/**
 * Get user gamification stats
 */
export const getUserStats = async (userId: string): Promise<GamificationStats> => {
  // In a real app, we would fetch this from an API
  // For now, return mock data
  return {
    level: 3,
    points: 350,
    nextLevelPoints: 500,
    badges: [],
    completedChallenges: 5,
    activeChallenges: 3,
    streakDays: 7,
    progressToNextLevel: 70,
    totalPoints: 350,
    currentLevel: 3,
    badgesCount: 4,
    pointsToNextLevel: 150,
    lastActivityDate: new Date().toISOString(),
    challenges: mockChallenges,
    recentAchievements: mockBadges
  };
};
