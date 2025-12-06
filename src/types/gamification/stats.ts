// @ts-nocheck

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
  progressToNextLevel?: number;
  currentLevel?: number;
  pointsToNextLevel?: number;
  nextLevelPoints?: number;
  completedChallenges?: number;
  totalChallenges?: number;
  activeChallenges?: number;
  streakDays?: number;
  longestStreak?: number;
  unlockedBadges?: number;
  totalBadges?: number;
  recentAchievements?: any[];
  progress?: number;
}
