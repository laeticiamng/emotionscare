
export interface GamificationStats {
  level: number;
  points: number;
  streakDays: number;
  longestStreak: number;
  completedChallenges: number;
  totalChallenges: number;
  unlockedBadges: number;
  totalBadges: number;
  rank?: string;
  xp?: number;
  xpToNextLevel?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  completed: boolean;
  deadline?: Date | string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  icon?: string;
  completedAt?: Date | string;
  status?: 'active' | 'completed' | 'expired' | 'locked';
  name?: string;
  completions?: number;
  goal?: number;
  total?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  achieved: boolean;
  achievedAt?: Date | string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress?: number;
  total?: number;
  criteria?: string;
  icon?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  points: number;
  avatar?: string;
  level?: number;
  department?: string;
  streak?: number;
  change?: number; // change in rank compared to previous period
}
