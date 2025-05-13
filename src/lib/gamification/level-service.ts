
import { GamificationLevel } from '@/types/gamification';

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  500,   // Level 4
  1000,  // Level 5
  2000,  // Level 6
  3500,  // Level 7
  5000,  // Level 8
  7500,  // Level 9
  10000  // Level 10
];

/**
 * Get level data based on points
 */
export const getLevelData = (points: number): GamificationLevel => {
  // Determine current level
  let currentLevel = 1;
  let nextLevel = 2;
  let currentLevelThreshold = 0;
  let nextLevelThreshold = LEVEL_THRESHOLDS[1];
  
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      currentLevel = i + 1;
      currentLevelThreshold = LEVEL_THRESHOLDS[i];
      nextLevel = i + 2;
      nextLevelThreshold = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i] * 2;
      break;
    }
  }
  
  // Calculate progress to next level
  const pointsInCurrentLevel = points - currentLevelThreshold;
  const pointsToNextLevel = nextLevelThreshold - currentLevelThreshold;
  const progress = Math.min(100, Math.round((pointsInCurrentLevel / pointsToNextLevel) * 100));
  
  return {
    currentLevel,
    nextLevel,
    progress,
    points,
    pointsToNextLevel: nextLevelThreshold - points
  };
};

/**
 * Calculate new level based on points
 */
export const calculateLevel = (points: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1; // Default to level 1
};
