
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: string;
  earnedAt?: string;
  progress?: number;
  total?: number;
  color?: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  points: number;
  progress: number;
  total: number;
  completed: boolean;
  deadline?: string;
  icon?: string;
  completions?: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  points: number;
  rank: number | string;
  avatar?: string;
  avatarUrl?: string;
  department?: string;
  trend?: 'up' | 'down' | 'same';
  previousRank?: number;
}

export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[];
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  
  // Optional properties
  rank?: string;
  activeChallenges?: number;
  streakDays?: number;
  nextLevelPoints?: number;
  progressToNextLevel?: number;
  totalPoints?: number;
  badgesCount?: number;
  challenges?: Challenge[];
  recentAchievements?: Badge[];
  nextLevel?: {
    points: number;
    rewards: string[];
  };
  currentLevel?: number;
  pointsToNextLevel?: number;
  lastActivityDate?: string;
  
  // Admin dashboard specific properties
  activeUsersPercent?: number;
  totalBadges?: number;
  badgeLevels?: { level: string; count: number; }[];
  topChallenges?: { name: string; completions: number; }[];
}
