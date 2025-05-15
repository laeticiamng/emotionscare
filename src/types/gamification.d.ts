
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
}

export interface Badge {
  id: string;
  name?: string;
  description: string;
  image_url?: string;
  type?: string;
  level?: string;
  total?: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  score: number;
  rank: number;
  name?: string;
  avatarUrl?: string;
  progress?: number;
  level?: number;
}
