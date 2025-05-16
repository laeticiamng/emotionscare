
export interface GamificationStats {
  points: number;
  level: number | string;
  badges: Badge[];
  completedChallenges: number;
  totalChallenges: number;
  challenges: Challenge[];
  streak: number;
  nextLevel: {
    points: number;
    level: number;
    rewards: string[];
  };
  progress: number;
  leaderboard: LeaderboardEntry[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  progress: number;
  completed: boolean;
  status?: 'active' | 'completed' | 'failed' | 'locked';
  icon?: React.ReactNode;
  isDaily?: boolean;
  isWeekly?: boolean;
  xp?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  imageUrl?: string;
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: string;
  dateEarned?: string;
  progress?: number;
  completed?: boolean;
  rarity?: string;
  unlocked?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  level?: number | string;
  isCurrentUser?: boolean;
  department?: string;
  trend?: 'up' | 'down' | 'stable';
  userId?: string;
  username?: string;
}
