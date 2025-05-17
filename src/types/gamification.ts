
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
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  trend?: 'up' | 'down' | 'stable';
  previousRank?: number;
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
