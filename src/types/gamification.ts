
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
  // Additional properties for compatibility
  name?: string;
  target?: number;
  reward?: number | string;
  expiresAt?: string;
  type?: string;
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
  // Additional properties for compatibility
  icon?: string;
  threshold?: number;
  unlocked?: boolean;
  imageUrl?: string;
  image_url?: string;
  awarded_at?: Date | string;
  dateEarned?: string;
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
  // Additional properties for compatibility
  completedChallenges?: number;
  activeChallenges?: number;
  streakDays?: number;
  progressToNextLevel?: number;
  challenges?: Challenge[];
  nextLevel?: {
    points: number;
    rewards: any[];
  };
  achievements?: any[];
  totalPoints?: number;
  currentLevel?: number;
  pointsToNextLevel?: number;
  badgesCount?: number;
  lastActivityDate?: string;
  totalChallenges?: number;
}
