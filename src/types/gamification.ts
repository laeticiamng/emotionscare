
/**
 * Gamification Types
 * --------------------------------------
 * This file defines the official types for gamification functionality.
 * Any new property or correction must be documented here and synchronized across all components.
 */

export interface GamificationStats {
  points: number;
  level: number;
  streak: number;
  badges?: Badge[];
  challenges: Challenge[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  completedChallenges: number;
  totalChallenges: number;
  activeChallenges?: number;
  progress: number;
  rank: string;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  badgesCount: number;
  nextLevel: {
    points: number;
    rewards: string[];
  };
  lastActivityDate: string;
  nextLevelPoints?: number;
  // Additional fields used by components
  streakDays?: number;
  longestStreak?: number;
  unlockedBadges?: number;
  totalBadges?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  total: number;
  earnedDate?: string;
  threshold?: number;
  completed?: boolean;
  level?: number;
  imageUrl?: string;
  image_url?: string; // Legacy field - use imageUrl instead
  achieved?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  isCompleted?: boolean; // Legacy field - use completed instead
  name?: string; // Legacy field - use title instead
  points?: number;
  deadline?: string;
  completions?: number;
  totalSteps?: number;
  status?: 'completed' | 'failed' | 'locked' | 'ongoing' | 'active' | 'available' | 'in-progress';
  category?: string;
  goal?: number;
  icon?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatarUrl?: string;
  lastActive?: string;
  progress?: number;
  level?: number;
  points?: number;
  trend?: 'up' | 'down' | 'stable';
  userId?: string;
}
