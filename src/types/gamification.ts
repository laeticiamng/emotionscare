
export interface GamificationStats {
  points: number;
  level: number;
  rank: string;
  badges: Badge[];
  completedChallenges: number;
  activeChallenges: number;
  streak: number;
  nextLevelPoints: number;
  progressToNextLevel: number;
  totalPoints?: number;
  badgesCount?: number;
  streakDays?: number;
  challenges?: Challenge[];
  nextLevel?: {
    points: number;
    rewards: string[];
  };
  achievements?: Achievement[];
  currentLevel?: number;
  pointsToNextLevel?: number;
  lastActivityDate?: string;
  recentAchievements?: Badge[];
  progress?: number;
}

export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  points: number;
  status: 'completed' | 'locked' | 'active' | 'ongoing' | 'available' | 'failed';
  category: string;
  type?: string;
  progress?: number;
  goal?: number;
  icon?: string;
  startDate?: string;
  endDate?: string;
  completed?: boolean;
  total?: number;
  level?: string | number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  icon?: string;
  threshold?: number;
  type?: string;
  image?: string;
  date?: string;
  level?: string | number;
  unlocked?: boolean;
  unlock_date?: string;
  category?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  points: number;
  icon?: string;
}

export interface LeaderboardEntry {
  userId?: string;
  id?: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  points: number;
  rank?: number;
  position?: number;
  badges?: number;
  streak?: number;
  department?: string;
  level?: number;
  delta?: number;
  badge?: string;
}
