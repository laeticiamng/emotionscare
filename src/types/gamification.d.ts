
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  earned_date?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'rare' | 'epic' | 'legendary' | 'common';
  category?: string;
  icon?: string;
  level?: number | string;
  image?: string;
  unlockedAt?: string;
  dateEarned?: string;
  progress?: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  completed?: boolean;
  unlocked?: boolean;
  imageUrl?: string;
}

export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  points: number;
  completed: boolean;
  progress?: number;
  totalSteps?: number;
  deadline?: string;
  startDate?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  completions?: number;
  badge?: string;
  requirement?: number;
  current?: number;
  goal?: number;
  status?: 'active' | 'completed' | 'failed' | 'locked' | 'ongoing' | 'available';
  isDaily?: boolean;
  isWeekly?: boolean;
  icon?: React.ReactNode;
  failed?: boolean;
  xp?: number;
  type?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  position?: number;
  trend?: 'up' | 'down' | 'stable';
  badges?: number;
  level?: number;
  score?: number;
  change?: number;
  department?: string;
  userId?: string;
  username?: string;
  isCurrentUser?: boolean;
}

export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[] | number;
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  activeUsersPercent?: number;
  totalBadges?: number;
  badgeLevels?: { level: string; count: number; }[];
  topChallenges?: (Challenge & { name: string; completions: number; })[];
  completionRate?: number;
  rewardsEarned?: number;
  userEngagement?: number;
  progress: number;
  challenges: Challenge[];
  achievements?: Badge[];
  leaderboard?: LeaderboardEntry[];
  nextLevelPoints?: number;
  lastActivityDate?: string;
  nextLevel?: {
    points: number;
    level?: number;
    rewards: string[];
  };
  rank?: string;
  activeChallenges?: number;
  streakDays?: number;
  pointsToNextLevel?: number;
  progressToNextLevel?: number;
  totalPoints?: number;
  badgesCount?: number;
  currentLevel?: number;
  recentAchievements?: Badge[];
}
