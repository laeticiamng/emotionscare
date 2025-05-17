
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  image_url?: string;
  level?: string | number;
  category?: string;
  unlocked_at?: string;
  unlockedAt?: string;
  progress?: number;
  color?: string;
  type?: 'achievement' | 'milestone' | 'special';
  threshold?: number;
  userId?: string;
}

export interface Challenge {
  id: string;
  title: string;
  name?: string;
  description: string;
  points: number;
  status: 'completed' | 'failed' | 'locked' | 'ongoing' | 'active' | 'available';
  category: string;
  progress?: number;
  goal?: number;
  icon?: string;
  level?: string | number;
  completions?: number;
  deadline?: string;
  totalSteps?: number;
  completed?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  level?: number;
  streak?: number;
  userId?: string;
  trend?: 'up' | 'down' | 'stable';
  badges?: Badge[];
}

export interface GamificationStats {
  points: number;
  level: number;
  rank: string;
  badges: Badge[];
  streak: number;
  nextLevelPoints: number;
  progress: number;
  recentAchievements?: Badge[];
}
