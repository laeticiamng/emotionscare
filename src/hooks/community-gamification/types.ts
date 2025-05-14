
import { Achievement, Badge, Challenge, GamificationStats } from '@/types/gamification';

export type { Achievement, Badge, Challenge, GamificationStats };

export interface ChallengeProgressUpdate {
  userId: string;
  challengeId: string;
  progress: number;
  completed?: boolean;
}

export interface BadgeAward {
  userId: string;
  badgeId: string;
  date: Date;
}

export interface GamificationAction {
  type: string;
  userId: string;
  points?: number;
  data?: any;
}

// Re-export types using proper syntax for isolatedModules
export type { GamificationLevel, LeaderboardEntry } from '@/types/gamification';
