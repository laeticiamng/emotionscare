
export interface GamificationStats {
  points: number;
  level: number;
  rank?: string;
  badges: Badge[];
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  activeChallenges?: number;
  streakDays?: number;
  nextLevelPoints?: number;
  progressToNextLevel?: number;
  totalPoints?: number;
  badgesCount?: number;
  challenges?: Challenge[];
  recentAchievements?: any[];
  nextLevel?: {
    points: number;
    rewards: string[];
  };
  achievements?: any[];
  currentLevel?: number;
  pointsToNextLevel?: number;
  lastActivityDate?: string;
  progress?: number;
  
  // Admin dashboard specific properties
  activeUsersPercent?: number;
  totalBadges?: number;
  badgeLevels?: Array<{ level: string; count: number }>;
  topChallenges?: Array<{ name: string; completions: number }>;
}

export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  points: number;
  status: string;
  category?: string;
  progress?: number;
  goal?: number;
  type?: string;
  total?: number;
}

export interface Badge {
  id: string;
  name?: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  icon?: string;
  icon_url?: string;
  type?: string;
  level?: string;
  unlocked?: boolean;
  unlockedAt?: Date | string;
  progress?: number;
  total?: number;
  dateEarned?: string;
  awarded_at?: Date | string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  user_id?: string;
  score: number;
  rank: number;
  name?: string;
  user_name?: string;
  avatarUrl?: string;
  avatar_url?: string;
  progress?: number;
  level?: number;
}
