
export type Period = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'completed' | 'failed' | 'locked' | 'ongoing' | 'active' | 'available';
  category: string;
  progress?: number;
  goal?: number;
  icon?: string;
  level?: string | number;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  image?: string;
  level?: number;
  acquired?: boolean;
  date_acquired?: string;
  category?: string;
  points?: number;
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
