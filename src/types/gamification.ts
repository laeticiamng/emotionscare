
export interface GamificationStats {
  level: number;
  points: number;
  badges: number;
  streakDays: number;
  completedChallenges: number;
  nextLevelPoints: number;
  progress: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  earnedAt?: string;
  progress?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  completed: boolean;
  endDate?: string;
  badgeId?: string;
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';
