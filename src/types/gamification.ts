
export interface Challenge {
  id: string;
  name: string;
  title?: string;
  description: string;
  icon?: string;
  points: number;
  completions?: number;
  progress?: number;
  total?: number;
  type: 'daily' | 'weekly' | 'one-time';
  category: 'emotion' | 'journal' | 'community' | 'coach' | 'activity';
  status?: 'complete' | 'in-progress' | 'not-started' | 'completed';
  completed?: boolean;
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
  level?: number;
}

export interface GamificationStats {
  level: number;
  points: number;
  badges: Badge[] | number;
  streak: number;
  currentLevel?: number;
  nextLevel?: number;
  pointsToNextLevel?: number;
  nextLevelPoints?: number;
  progressToNextLevel?: number;
  totalPoints?: number;
  streakDays?: number;
  lastActivityDate?: string;
  activeChallenges?: number;
  completedChallenges?: number;
  badgesCount?: number;
  rank?: string;
  recentAchievements?: any[];
  challenges?: Challenge[];
  leaderboard?: any[];
  streaks?: {
    current: number;
    longest: number;
    lastActivity: string;
  };
}
