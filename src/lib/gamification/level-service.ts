
// Calculate user level based on points
export function calculateLevel(points: number): { level: number; nextLevelPoints: number; progress: number } {
  // Simple level calculation: each level needs level * 100 points
  let level = 1;
  let pointsNeeded = 100;
  let remainingPoints = points;
  
  while (remainingPoints >= pointsNeeded) {
    remainingPoints -= pointsNeeded;
    level++;
    pointsNeeded = level * 100;
  }
  
  const progress = (remainingPoints / pointsNeeded) * 100;
  
  return {
    level,
    nextLevelPoints: pointsNeeded,
    progress
  };
}

// Get XP required for a specific level
export function getXpForLevel(level: number): number {
  let totalXp = 0;
  for (let i = 1; i < level; i++) {
    totalXp += i * 100;
  }
  return totalXp;
}

// Get level information including progress
export function getLevelInfo(points: number): { 
  level: number; 
  currentLevelXp: number;
  nextLevelXp: number;
  totalXpForCurrentLevel: number;
  progress: number;
} {
  const { level, nextLevelPoints, progress } = calculateLevel(points);
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = currentLevelXp + nextLevelPoints;
  
  return {
    level,
    currentLevelXp,
    nextLevelXp,
    totalXpForCurrentLevel: nextLevelPoints,
    progress
  };
}
