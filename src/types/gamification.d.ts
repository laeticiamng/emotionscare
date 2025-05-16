
export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  completed?: boolean;
  unlocked?: boolean;
  progress?: number;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  image_url?: string;
  earned_date?: string;
  icon?: string;
  level?: number | string;
  threshold?: number;
  points?: number;
  user_id?: string;
  icon_url?: string;
  total_required?: number;
  imageUrl?: string;
  dateEarned?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  xp?: number;
  progress: number;
  status?: 'active' | 'completed' | 'failed' | 'locked';
  deadline?: string;
  isDaily?: boolean;
  isWeekly?: boolean;
  icon?: React.ReactNode;
  failed?: boolean;
  goal?: number;
  type?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  completions?: number;
  badge?: string;
  requirement?: number;
  current?: number;
  completed?: boolean;
  name?: string;
  totalSteps?: number;
  startDate?: string;
}

export interface LeaderboardEntry {
  id: string;
  userId?: string;
  name: string;
  username?: string;
  avatar?: string;
  points: number;
  level?: number;
  rank?: number;
  position?: number;
  progress?: number;
  change?: number;
  isCurrentUser?: boolean;
  trend?: 'up' | 'down' | 'stable';
  badges?: number;
  score?: number;
  department?: string;
}

export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[] | number;
  completedChallenges: number;
  totalChallenges: number;
  challenges: Challenge[];
  streak: number;
  nextLevel: {
    points: number;
    level?: number;
    rewards: string[];
  };
  progress: number;
  rewards?: string[];
  // Additional properties
  rank?: string;
  activeChallenges?: number;
  streakDays?: number;
  pointsToNextLevel?: number;
  progressToNextLevel?: number;
  totalPoints?: number;
  badgesCount?: number;
  currentLevel?: number;
  recentAchievements?: Badge[];
  activeUsersPercent?: number;
  totalBadges?: number;
  badgeLevels?: { level: string; count: number; }[];
  topChallenges?: (Challenge & { name: string; completions: number; })[];
  completionRate?: number;
  rewardsEarned?: number;
  userEngagement?: number;
  lastActivityDate?: string;
  nextLevelPoints?: number;
  achievements?: Badge[];
  leaderboard?: LeaderboardEntry[];
}
