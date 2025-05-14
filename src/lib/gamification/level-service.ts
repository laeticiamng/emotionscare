
/**
 * Calculate user level based on points
 * @param points Total points earned by user
 * @returns Object containing level information
 */
export const calculateLevel = (points: number) => {
  // Simple level calculation: level = 1 + Math.floor(points / 100)
  const level = 1 + Math.floor(points / 100);
  const nextLevelPoints = level * 100;
  const pointsToNextLevel = nextLevelPoints - points;
  const progressToNextLevel = Math.min(100, Math.max(0, (points % 100)));
  
  return {
    level,
    nextLevelPoints,
    pointsToNextLevel,
    progressToNextLevel,
    totalPointsNeeded: nextLevelPoints,
  };
};

/**
 * Get level thresholds
 * Returns an array of point thresholds for each level
 */
export const getLevelThresholds = () => {
  return [0, 100, 250, 450, 700, 1000, 1500, 2000, 3000, 5000];
};
