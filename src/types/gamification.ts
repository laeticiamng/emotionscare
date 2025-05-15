
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
  description: string;
  type: string;
  progress: number;
  goal: number;
  reward: number | string;
  status: 'active' | 'completed' | 'failed';
  deadline?: string;
  startDate: string;
  category?: string;
  icon?: string;
  isTeamChallenge?: boolean;
  total?: number;
  completed?: boolean;
  points?: number;
  name?: string; // Added for compatibility
}

// Update for type compatibility with Dashboard and GamificationDashboard
export interface GamificationData extends GamificationStats {
  totalBadges: number;
  activeChallenges: number;
  leaderboard: {
    userId: string;
    name: string;
    score: number;
    position: number;
  }[];
  recentAchievements: {
    userId: string;
    name: string;
    badge: string;
    date: string;
  }[];
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
