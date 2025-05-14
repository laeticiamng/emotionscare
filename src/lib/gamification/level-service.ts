
import { GamificationStats } from '@/types/gamification';

/**
 * Calculate user level based on total points
 * @param points Total points
 * @returns Current level
 */
export function calculateLevel(points: number): number {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

/**
 * Calculate progress percentage to next level
 * @param points Total points
 * @returns Progress percentage (0-100)
 */
export function calculateProgressToNextLevel(points: number): number {
  const currentLevel = calculateLevel(points);
  const currentLevelMinPoints = ((currentLevel - 1) ** 2) * 100;
  const nextLevelMinPoints = (currentLevel ** 2) * 100;
  
  const pointsInCurrentLevel = points - currentLevelMinPoints;
  const pointsNeededForNextLevel = nextLevelMinPoints - currentLevelMinPoints;
  
  const progress = (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;
  return Math.min(Math.max(0, Math.floor(progress)), 100); // Ensure between 0-100
}

/**
 * Calculate points needed to reach the next level
 * @param currentLevel Current level
 * @returns Points needed for next level
 */
export function calculatePointsToNextLevel(currentLevel: number): number {
  const currentLevelMinPoints = ((currentLevel - 1) ** 2) * 100;
  const nextLevelMinPoints = (currentLevel ** 2) * 100;
  
  return nextLevelMinPoints - currentLevelMinPoints;
}

/**
 * Get mock gamification stats for a user
 * @returns Gamification stats
 */
export function getMockGamificationStats(): GamificationStats {
  const totalPoints = 340;
  const level = calculateLevel(totalPoints);
  const progress = calculateProgressToNextLevel(totalPoints);
  const pointsToNext = calculatePointsToNextLevel(level);
  
  return {
    level: level,
    points: totalPoints,
    nextLevelPoints: (level + 1) * (level + 1) * 100,
    badges: [],
    completedChallenges: 7,
    activeChallenges: 3,
    streakDays: 5,
    progressToNextLevel: progress,
    totalPoints: totalPoints,
    currentLevel: level,
    badgesCount: 5,
    pointsToNextLevel: pointsToNext,
    challenges: [],
    recentAchievements: []
  };
}
