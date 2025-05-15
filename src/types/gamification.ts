
export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[];
  challenges: Challenge[];
  streak: number;
}

export interface GamificationData {
  totalPoints: number;
  level: number;
  badges: number;
  progress: number;
  nextLevel: number;
  streakDays: number;
  completedChallenges: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  progress?: number;
  category?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  completed: boolean;
  expiresAt?: string;
  category?: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  level: number;
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';
