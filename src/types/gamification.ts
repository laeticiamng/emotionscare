
export interface GamificationStats {
  points: number;
  level: number;
  dailyStreak: number;
  totalSessions: number;
  badgesCount: number;
  progress: number;
  nextLevel: number;
  pointsToNextLevel: number;
  rank?: string;
  badges?: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  category?: string;
  earnedAt?: string;
  earned_at?: string;
  icon?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  endDate?: string;
  reward?: {
    points: number;
    badge?: Badge;
  };
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  position: number;
  avatar?: string;
  badges?: Badge[];
}
