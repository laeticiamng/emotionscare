
/**
 * Calculates the progress towards the next level as a percentage
 * @param currentXp Current XP of the user
 * @returns A number between 0 and 100 representing the progress percentage
 */
export const calculateProgressToNextLevel = (currentXp: number): number => {
  // Sample implementation - can be adjusted based on level formula
  const baseXP = 100;
  const level = Math.floor(Math.sqrt(currentXp / baseXP)) + 1;
  const currentLevelMinXP = Math.pow(level - 1, 2) * baseXP;
  const nextLevelMinXP = Math.pow(level, 2) * baseXP;
  
  // Calculate the progress percentage
  const xpForThisLevel = nextLevelMinXP - currentLevelMinXP;
  const xpGainedInThisLevel = currentXp - currentLevelMinXP;
  const progressPercentage = (xpGainedInThisLevel / xpForThisLevel) * 100;
  
  return Math.min(Math.max(progressPercentage, 0), 100);
};

/**
 * Returns the progress percentage to the next level
 */
export const getProgressToNextLevel = (userId: string): Promise<number> => {
  // This would normally fetch user XP from a database
  // For now, we return a mock value
  return Promise.resolve(calculateProgressToNextLevel(1250));
};

/**
 * Calculates the amount of XP needed to reach the next level
 */
export const calculateXpToNextLevel = (userId: string): Promise<number> => {
  // This would normally calculate based on current XP and level formula
  // For now, we return a mock value
  return Promise.resolve(350);
};
