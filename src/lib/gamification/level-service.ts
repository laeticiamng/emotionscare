// @ts-nocheck

/**
 * Calculates user level based on points
 */
export const calculateLevel = (points: number): number => {
  if (points < 100) return 1;
  if (points < 250) return 2;
  if (points < 500) return 3;
  if (points < 1000) return 4;
  if (points < 2000) return 5;
  if (points < 3500) return 6;
  if (points < 5000) return 7;
  if (points < 7500) return 8;
  if (points < 10000) return 9;
  return 10 + Math.floor((points - 10000) / 2500);
};

/**
 * Returns points needed for next level
 */
export const pointsForNextLevel = (currentLevel: number): number => {
  switch (currentLevel) {
    case 1: return 100;
    case 2: return 250;
    case 3: return 500;
    case 4: return 1000;
    case 5: return 2000;
    case 6: return 3500;
    case 7: return 5000;
    case 8: return 7500;
    case 9: return 10000;
    default: return (currentLevel - 10) * 2500 + 10000;
  }
};

/**
 * Returns level progress percentage
 */
export const calculateLevelProgress = (points: number): number => {
  const currentLevel = calculateLevel(points);
  const currentLevelMinPoints = pointsForPreviousLevel(currentLevel);
  const nextLevelPoints = pointsForNextLevel(currentLevel);
  
  const levelPoints = nextLevelPoints - currentLevelMinPoints;
  const userPointsInLevel = points - currentLevelMinPoints;
  
  return Math.min(100, Math.round((userPointsInLevel / levelPoints) * 100));
};

/**
 * Returns points for previous level
 */
export const pointsForPreviousLevel = (level: number): number => {
  switch (level) {
    case 1: return 0;
    case 2: return 100;
    case 3: return 250;
    case 4: return 500;
    case 5: return 1000;
    case 6: return 2000;
    case 7: return 3500;
    case 8: return 5000;
    case 9: return 7500;
    case 10: return 10000;
    default: return (level - 11) * 2500 + 10000;
  }
};
