
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon?: string;
  completed?: boolean;
  level?: string;
  image_url?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  completions?: number;
  totalSteps?: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  badges?: number;
  level?: number;
  userId?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface GamificationStats {
  points: number;
  level: number;
  streak?: number;
  completionRate?: number;
  completedChallenges?: number;
  totalChallenges?: number;
  nextLevelPoints?: number;
  lastActivityDate?: string;
  challenges?: Challenge[];
  leaderboard?: LeaderboardEntry[];
  rewardsEarned?: number;
  userEngagement?: number;
  achievements?: Badge[];
  progress?: number;
  badges?: Badge[];
  badgeLevels?: { level: string; count: number }[];
  topChallenges?: any[];
  activeUsersPercent?: number;
  totalBadges?: number;
  activeChallenges?: Challenge[];
}
