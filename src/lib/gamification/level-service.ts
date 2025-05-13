
import { GamificationStats, GamificationLevel } from '@/types/gamification';

// Define levels with their requirements and titles
const levels: GamificationLevel[] = [
  {
    level: 1,
    pointsRequired: 0,
    title: "Novice Émotionnel"
  },
  {
    level: 2,
    pointsRequired: 100,
    title: "Apprenti de Pleine Conscience"
  },
  {
    level: 3,
    pointsRequired: 300,
    title: "Explorateur d'Émotions"
  },
  {
    level: 4,
    pointsRequired: 600,
    title: "Aventurier Émotionnel"
  },
  {
    level: 5,
    pointsRequired: 1000,
    title: "Maître du Calme"
  },
  {
    level: 6,
    pointsRequired: 1500,
    title: "Gardien des Émotions"
  },
  {
    level: 7,
    pointsRequired: 2200,
    title: "Érudit des Sentiments"
  },
  {
    level: 8,
    pointsRequired: 3000,
    title: "Sage Émotionnel"
  },
  {
    level: 9,
    pointsRequired: 4000,
    title: "Expert en Intelligence Émotionnelle"
  },
  {
    level: 10,
    pointsRequired: 5200,
    title: "Maître de la Maîtrise Émotionnelle"
  }
];

// Calculate user level based on points
export const calculateLevel = (points: number): { level: number; title: string; nextLevelPoints: number; progress: number } => {
  // Find current level based on points
  let currentLevel = levels[0];
  let nextLevel = levels[1];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].pointsRequired) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || levels[i];
      break;
    }
  }
  
  // Calculate progress to next level
  const currentLevelPoints = currentLevel.pointsRequired;
  const nextLevelPoints = nextLevel.pointsRequired;
  const pointsToNextLevel = nextLevelPoints - currentLevelPoints;
  const pointsProgress = points - currentLevelPoints;
  
  // Calculate percentage progress to next level
  const progress = currentLevel === nextLevel 
    ? 100 
    : Math.min(100, Math.floor((pointsProgress / pointsToNextLevel) * 100));
  
  return {
    level: currentLevel.level,
    title: currentLevel.title,
    nextLevelPoints: nextLevelPoints,
    progress: progress
  };
};

// Get user's gamification stats
export const getUserGamificationStats = (
  userId: string,
  totalPoints: number,
  badgesCount: number,
  completedChallenges: number,
  activeChallenges: number
): GamificationStats => {
  const { level, title, nextLevelPoints, progress } = calculateLevel(totalPoints);
  
  // Calculate the points needed for the next level
  const pointsToNextLevel = nextLevelPoints - totalPoints;
  
  return {
    level,
    points: totalPoints,
    nextLevelPoints,
    badges: [],  // In a real implementation, this would be actual badges
    completedChallenges,
    activeChallenges,
    streakDays: Math.floor(Math.random() * 30),  // Mock data
    progressToNextLevel: progress,
    // Compatibility props
    totalPoints,
    currentLevel: level,
    badgesCount,
    pointsToNextLevel
  };
};
