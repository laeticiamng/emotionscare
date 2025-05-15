
import { Badge } from './types';

export interface GamificationStats {
  points: number;
  level: number;
  rank: string;
  badges: Badge[];
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  activeChallenges: number;
  streakDays: number;
  nextLevelPoints: number;
  progressToNextLevel: number;
  totalPoints: number;
  badgesCount: number;
  challenges: Challenge[];
  recentAchievements: any[];
  nextLevel: number | {
    points: number;
    rewards: string[];
  };
  achievements?: any[];
  currentLevel: number;
  pointsToNextLevel: number;
  lastActivityDate: string;
  leaderboard?: any[];
}

export interface Challenge {
  id: string;
  title: string;
  name?: string;
  description: string;
  type: string;
  progress: number;
  goal?: number;
  target?: number;
  reward: number | string;
  status: 'active' | 'completed' | 'failed' | 'expired' | 'pending';
  deadline?: string;
  startDate: string;
  category?: string;
  icon?: string;
  isTeamChallenge?: boolean;
  total?: number;
  completed?: boolean;
  points?: number;
  expiresAt?: string;
}

export interface LeaderboardEntry {
  userId: string;
  name?: string;
  avatarUrl?: string;
  points: number;
  rank: number;
  badges?: number;
  level: number;
  completedChallenges?: number;
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';
