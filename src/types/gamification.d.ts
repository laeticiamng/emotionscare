
export interface GamificationStats {
  points: number;
  level: number;
  streak: number;
  streakDays: number;
  badges: Badge[];
  challenges: Challenge[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  completedChallenges: number;
  totalChallenges: number;
  activeChallenges?: number;
  progress: number;
  rank: string;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  badgesCount: number;
  nextLevel: {
    points: number;
    rewards: string[];
  };
  lastActivityDate: string;
  badges?: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  total: number;
  earnedDate?: string;
  threshold?: number;
  completed?: boolean;
  level?: number;
  imageUrl?: string;
  image_url?: string;
  achieved?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  name?: string;
  points?: number;
  deadline?: string;
  completions?: number;
  totalSteps?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatarUrl?: string;
  lastActive?: string;
  progress?: number;
  level?: number;
  points?: number;
  trend?: 'up' | 'down' | 'stable';
  userId?: string;
}
