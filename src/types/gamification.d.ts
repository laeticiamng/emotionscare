
export interface Challenge {
  id: string;
  title: string;
  name?: string;
  description: string;
  category?: string;
  points: number;
  progress: number;
  goal?: number;
  total?: number;
  completed?: boolean;
  status?: 'active' | 'completed' | 'failed' | 'pending';
  startDate?: string;
  endDate?: string;
  icon?: string;
  type?: string;
}

export interface GamificationStats {
  level: number;
  points: number;
  badges: number | any[];
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  nextLevel?: {
    points: number;
    rewards: string[];
  } | number;
  nextLevelPoints?: number;
  pointsToNextLevel?: number;
  progressToNextLevel?: number;
  challenges?: Challenge[];
  totalPoints?: number;
  currentLevel?: number;
  streakDays?: number;
  lastActivityDate?: string;
  activeChallenges?: number;
  badgesCount?: number;
  rank?: string;
  recentAchievements?: any[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  department?: string;
  level?: number;
  badges?: number;
  streak?: number;
  user_id?: string; // Added for compatibility
  user_name?: string; // Added for compatibility
  avatar_url?: string; // Added for compatibility
  badges_count?: number; // Added for compatibility
  challenges_completed?: number; // Added for compatibility
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  threshold?: number;
  type?: string;
  imageUrl?: string;
  image_url?: string;
  unlocked?: boolean;
  unlockedAt?: Date | string;
  category?: string;
  level?: string | number;
  points?: number;
  user_id?: string;
  icon_url?: string;
  total_required?: number;
  total?: number; // Added for compatibility
  image?: string;
  dateEarned?: string;
  awarded_at?: Date | string;
  progress?: number;
}
