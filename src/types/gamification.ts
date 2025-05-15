
export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[];
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  activeUsersPercent?: number;
  totalBadges?: number;
  badgeLevels?: { level: string; count: number; }[];
  topChallenges?: (Challenge & { name: string; completions: number; })[];
  completionRate?: number;
  rewardsEarned?: number;
  userEngagement?: number;
  progress: number;
  challenges: Challenge[];
  achievements: Badge[];
  leaderboard: LeaderboardEntry[];
  nextLevelPoints: number;
  lastActivityDate?: string;
  // Additional properties used in components
  rank?: string;
  activeChallenges?: number;
  streakDays?: number;
  pointsToNextLevel?: number;
  progressToNextLevel?: number;
  totalPoints?: number;
  badgesCount?: number;
  currentLevel?: number;
  recentAchievements?: Badge[];
  nextLevel?: {
    points: number;
    rewards: string[];
  };
}

export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  points: number;
  completed: boolean;
  progress?: number;
  totalSteps?: number;
  deadline?: string;
  startDate?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  completions?: number;
  badge?: string;
  requirement?: number;
  current?: number;
  goal?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  earned_date?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  category?: string;
  icon?: string;
  // Add additional properties used in components
  level?: number | string;
  image?: string;
  unlockedAt?: string;
  progress?: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  trend?: 'up' | 'down' | 'stable';
  badges?: number;
  level?: number;
  score?: number;
  change?: number;
  department?: string;
}
