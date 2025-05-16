
export interface GamificationStats {
  totalPoints: number;
  currentLevel: number;
  nextLevel: number;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  streakDays: number;
  badgesCount: number;
  challenges: Challenge[];
  activeChallenges: number;
  completedChallenges: number;
  recentBadges: Badge[];
  totalBadges: number;
  activeUsersPercent: number;
  completionRate: number;
  badges: Badge[];
  badgeLevels: Record<string, Badge[]>;
  points: number;
  rewards: string[];
  lastActivityDate: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  completed: boolean;
  deadline?: string;
  isDaily?: boolean;
  isWeekly?: boolean;
  status?: 'active' | 'completed' | 'expired';
  name?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  image_url?: string; // Legacy support
  earned: boolean;
  date?: string;
  level?: number;
  points?: number;
  category?: string;
  icon?: any;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
}
