
/**
 * Calculate the user's level based on their points
 */
export const calculateLevel = (points: number): { level: number, nextLevelPoints: number, progress: number } => {
  // Simple level calculation - each level requires 100 points * level number
  const basePoints = 100;
  let level = 1;
  let requiredPoints = basePoints;
  
  while (points >= requiredPoints) {
    level++;
    requiredPoints += basePoints * level;
  }
  
  const previousLevelPoints = requiredPoints - (basePoints * level);
  const pointsForCurrentLevel = points - previousLevelPoints;
  const pointsNeededForNextLevel = requiredPoints - previousLevelPoints;
  const progress = Math.round((pointsForCurrentLevel / pointsNeededForNextLevel) * 100);
  
  return {
    level,
    nextLevelPoints: requiredPoints,
    progress
  };
};
