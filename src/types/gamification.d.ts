
export interface GamificationStats {
  points: number;
  level: number | string;
  badges: Badge[];
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  challenges: Challenge[];
  progress: number;
  leaderboard: LeaderboardEntry[];
  
  // Admin dashboard properties
  totalBadges?: number;
  activeUsersPercent?: number;
  completionRate?: number;
  topChallenges?: Challenge[];
  badgeLevels?: Array<{level: string, count: number}>;
  
  // User dashboard properties
  currentLevel?: number;
  pointsToNextLevel?: number;
  progressToNextLevel?: number;
  streakDays?: number;
  lastActivityDate?: string;
  activeChallenges?: number;
  badgesCount?: number;
  totalPoints?: number;
  
  // Compatibility with previous implementations
  nextLevel?: {
    points: number;
    rewards: string[];
    level?: number;
  };
  rank?: string;
  achievements?: Badge[];
  recentAchievements?: Badge[];
  rewardsEarned?: number;
  userEngagement?: number;
  emotional_balance?: number;
  streak_days?: number;
  total_scans?: number;
  badges_earned?: Badge[];
  next_milestone?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  progress: number;
  completed: boolean;
  status?: 'active' | 'completed' | 'failed' | 'locked' | 'not-started' | 'expired' | 'ongoing' | 'available';
  icon?: React.ReactNode;
  
  // Additional properties used in components
  name?: string;
  isDaily?: boolean;
  isWeekly?: boolean;
  xp?: number;
  goal?: number;
  total?: number;
  deadline?: string;
  difficulty?: string;
  completions?: number;
  totalSteps?: number;
  type?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked?: boolean;
  level?: string | number;
  
  // Support for different image URL formats
  image?: string;
  imageUrl?: string;
  image_url?: string;
  icon_url?: string;
  
  // Additional properties
  unlockedAt?: string;
  dateEarned?: string;
  awarded_at?: string;
  progress?: number;
  completed?: boolean;
  rarity?: string;
  icon?: React.ReactNode;
  threshold?: number;
  points?: number;
  user_id?: string;
  total_required?: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  level: number | string;
  isCurrentUser?: boolean;
  department?: string;
  trend?: 'up' | 'down' | 'stable';
  userId?: string;
  username?: string;
  badges?: number;
}
