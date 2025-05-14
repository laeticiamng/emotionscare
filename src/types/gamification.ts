
export interface GamificationStats {
  points: number;
  level: number;
  nextLevelPoints: number;
  rank?: string;
  badges?: any[];
  completedChallenges?: number;
  activeChallenges?: number;
  streakDays?: number;
  progressToNextLevel?: number;
  challenges?: any[];
  recentAchievements?: any[];
  streak?: number;
  nextLevel?: { 
    points: number;
    rewards: any[];
  };
  achievements?: any[];
  currentLevel?: number;
  milestones?: any[];
  rewards?: any[];
  leaderboard?: LeaderboardEntry[];
  totalActions?: number;
  lastActivityDate?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  anonymityCode?: string;
  points: number;
  level: number;
  rank?: number;
  position?: number;
  avatar?: string;
}
