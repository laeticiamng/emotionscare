
export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  imageUrl?: string;
  category?: string;
  unlocked?: boolean;
  progress?: number;
  threshold?: number;
  timestamp?: string;
  type?: string;
  level?: number;
  user_id?: string;
  userId?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  startDate: string;
  endDate: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  userId?: string;
  name?: string; // For compatibility
}

export interface GamificationStats {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  streak: number;
  totalBadges: number;
  totalChallenges: number;
  completedChallenges: number;
  rank?: string;
  title?: string;
  progressToNextLevel?: number; // For compatibility
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  level: number;
  experience: number;
  rank: number;
  department?: string;
  badge?: string | Badge;
  streak?: number;
  score?: number;
  badgeCount?: number;
  completedChallenges?: number;
  position?: number; // For backward compatibility
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  unlocked: boolean;
  progress: number;
  total: number;
  imageUrl: string;
  timestamp?: string;
  level?: number;
}

export interface RewardSystem {
  badges: Badge[];
  challenges: Challenge[];
  stats: GamificationStats;
  leaderboard: LeaderboardEntry[];
  achievements: Achievement[];
}
