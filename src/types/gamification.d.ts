
export interface Badge {
  id: string;
  name: string;
  description: string;
  image?: string;
  imageUrl?: string;
  image_url?: string;
  category: 'progress' | 'journal' | 'music' | 'community' | 'activity' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: string;
  progress?: number;
  completed: boolean;
  icon?: React.ReactNode;
  // Adding properties needed by components
  unlocked?: boolean;
  level?: string | number;
  dateEarned?: string;
  awarded_at?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  points: number;
  progress: number;
  completed: boolean;
  isDaily?: boolean;
  isWeekly?: boolean;
  status?: 'active' | 'completed' | 'expired' | 'failed' | 'locked' | 'not-started';
  deadline?: string;
  name?: string;
  // Adding properties needed by components
  goal?: number;
  total?: number;
  icon?: React.ReactNode;
  difficulty?: string;
  completions?: number;
  totalSteps?: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  level: number | string;
  isCurrentUser: boolean;
  badges?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface GamificationStats {
  points: number;
  level: number | string;
  badges: Badge[];
  completedChallenges: number;
  totalChallenges: number;
  challenges: Challenge[];
  streak: number;
  nextLevel?: {
    points: number;
    rewards: string[];
    level: number;
  };
  progress: number;
  leaderboard: LeaderboardEntry[];
  
  // Additional properties for various components
  currentLevel?: number;
  totalPoints?: number;
  badgesCount?: number;
  pointsToNextLevel?: number;
  progressToNextLevel?: number;
  streakDays?: number;
  lastActivityDate?: string;
  activeChallenges?: number;
  totalBadges?: number;
  activeUsersPercent?: number;
  completionRate?: number;
  topChallenges?: Challenge[];
  badgeLevels?: Record<string, number>[] | Array<{level: string, count: number}>;
  // Additional properties needed by the admin components
  rank?: string;
  nextLevelPoints?: number;
  recentAchievements?: Badge[];
  achievements?: Badge[];
  rewardsEarned?: number;
  userEngagement?: number;
  emotional_balance?: number;
  streak_days?: number;
  total_scans?: number;
  badges_earned?: Badge[];
  next_milestone?: number;
}
