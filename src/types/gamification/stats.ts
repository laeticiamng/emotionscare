
export interface GamificationStats {
  userId: string;
  level: number;
  xp: number;
  totalPoints: number;
  streak: number;
  achievements: number;
  badges: number;
  rank: string;
  nextLevel: number;
  lastActivity: string;
  progressToNextLevel?: number; // Added missing property
}
