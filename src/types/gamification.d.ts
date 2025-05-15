
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
}
