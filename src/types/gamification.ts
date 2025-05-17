
import { Badge } from './badge';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  completed: boolean;
  totalSteps?: number;
  completedSteps?: number;
  status?: 'completed' | 'failed' | 'locked' | 'ongoing' | 'active' | 'available';
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  deadline?: string;
  completions?: number;
  name?: string;
  tags?: string[];
  goal?: number;
  icon?: string;
  total?: number;
  type?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  trend?: 'up' | 'down' | 'stable';
  previousRank?: number;
  score?: number;
  level?: number;
  progress?: number;
  avatarUrl?: string;
  lastActive?: string;
  userId?: string;
}

export interface GamificationStats {
  level: number;
  points: number;
  nextLevelPoints: number;
  totalPoints: number;
  rank: number;
  challengesCompleted: number;
  challenges: Challenge[];
  streak: number;
  badges: Badge[];
  activeChallenges?: Challenge[];
  // Additional properties from UserDashboard/UserSidePanel
  xp?: number;
  xpToNextLevel?: number;
  streakDays?: number;
  longestStreak?: number;
  completedChallenges?: number;
  totalChallenges?: number;
  unlockedBadges?: number;
  totalBadges?: number;
}

export interface GamificationContextType {
  stats: GamificationStats;
  leaderboard: LeaderboardEntry[];
  challenges: Challenge[];
  badges: Badge[];
  earnPoints: (points: number, reason?: string) => void;
  completeChallenge: (challengeId: string) => void;
  earnBadge: (badgeId: string) => void;
  refreshStats: () => void;
  isLoading: boolean;
  error: Error | null;
}

// Export Badge type explicitly to resolve module declaration errors
export { Badge } from './badge';
