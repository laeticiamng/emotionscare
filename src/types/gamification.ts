
export interface GamificationStats {
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  badgesCount: number;
  streak: number;
  streakDays: number;
  lastActivityDate: string;
  activeChallenges: number;
  completedChallenges: number;
  recentAchievements?: Achievement[];
  level?: number;
  rank?: string;
  badges?: Badge[];
  points?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  status: 'active' | 'completed' | 'pending' | 'ongoing';
  progress?: number;
  completed?: boolean;
  name?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  date: string;
  points: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name?: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
}
