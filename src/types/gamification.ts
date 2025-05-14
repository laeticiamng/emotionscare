
export interface GamificationStats {
  points: number;
  level: number;
  nextLevelPoints: number;
  badges: Badge[];
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel: number;
  challenges?: Challenge[];
  recentAchievements?: Achievement[];
  currentLevel?: number;
  pointsToNextLevel?: number;
  totalPoints?: number;
  badgesCount?: number;
  lastActivityDate?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'active' | 'completed' | 'locked';
  progress: number;
  total: number;
  category: string;
  icon?: string;
  dueDate?: string;
  rewards?: string[];
  completed?: boolean;
  name?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  obtained: boolean;
  date?: string;
  level?: number;
  category?: string;
  name?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  points?: number;
  category?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  team?: string;
  level?: number;
}
