
export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[];
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  activeUsersPercent: number;
  totalBadges: number;
  badgeLevels: { level: string; count: number; }[];
  topChallenges: (Challenge & { name: string; completions: number; })[];
  completionRate: number;
  rewardsEarned: number;
  userEngagement: number;
  progress: number;
  challenges: Challenge[];
  achievements: Badge[];
  leaderboard: LeaderboardEntry[];
  nextLevelPoints: number;
  lastActivityDate?: string;
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
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  completions?: number;
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
}
