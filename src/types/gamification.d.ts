
export interface GamificationStats {
  points: number;
  level: number;
  progress: number;
  badges: Badge[];
  challenges: Challenge[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  streak: number;
  nextLevelPoints: number;
  completedChallenges: number;
  totalChallenges: number;
  rank: string;
  activeChallenges: number;
  streakDays: number;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  badgesCount: number;
  nextLevel?: {
    points: number;
    rewards: string[];
  };
  lastActivityDate?: string;
  // Admin-specific stats
  activeUsersPercent?: number;
  totalBadges?: number;
  badgeLevels?: { level: string; count: number }[];
  topChallenges?: Array<Challenge & { name: string; completions: number }>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  level: number;
  unlockedAt?: string;
  progress?: number; // For badges in progress, 0-100
  category?: string;
}

export interface Challenge {
  id: string;
  description: string;
  points: number;
  completed: boolean;
  name?: string;
  completions?: number;
  category?: string;
  deadline?: string;
  startDate?: string;
  progress?: number;
  badge?: string;
  requirement?: number;
  current?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  image: string;
  unlockedAt?: string;
  category?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  rank: number;
  score: number;
  change?: number; // positive = up, negative = down, 0 = no change
  department?: string;
  badges?: number;
}
