
export interface GamificationStats {
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  badgesCount: number;
  streakDays: number;
  lastActivityDate?: string;
  activeChallenges: number;
  completedChallenges: number;
  completed_challenges?: number; // For backward compatibility
  xpGained?: number;
}

export interface Challenge {
  id: string;
  name?: string;
  title: string;
  description: string;
  points: number;
  status: 'completed' | 'ongoing' | 'locked';
  category: string;
  completed?: boolean;
  progress?: number;
  deadline?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image?: string;
  icon?: string;
  category?: string;
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  requirement?: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  points: number;
  rank: number;
  streak?: number;
  badgeCount?: number;
}
