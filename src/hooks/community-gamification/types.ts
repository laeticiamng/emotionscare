
import { Badge as SystemBadge } from '@/types';

// Re-export the Badge type to avoid conflicts
export type Badge = SystemBadge;

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  status: 'available' | 'in-progress' | 'completed';
  progress: number;
  completedAt?: string;
  deadline?: string;
  requirements?: string[];
  rewards?: string[];
  completed?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
  category: string;
  awardedAt?: string;
  level?: number;
}

export interface GamificationStats {
  level: number;
  points: number;
  nextMilestone: number;
  progressToNextLevel: number;
  streakDays: number;
  totalBadges: number;
  totalChallenges: number;
  totalScans: number;
  badges: string[];
  recentAchievements: Achievement[];
  lastActivityDate?: string;
}

export interface UseCommunityGamificationResult {
  isProcessing: boolean;
  error: string;
  markChallengeCompleted: (challengeId: string) => Promise<Challenge>;
  trackChallengeProgress: (challengeId: string, progress: number) => Promise<Challenge>;
  activeChallenges: Challenge[];
  recommendedChallenges: Challenge[];
  acceptChallenge: (challengeId: string) => Promise<Challenge>;
  generatePersonalizedChallenges: () => Promise<Challenge[]>;
  completeChallenge: (challengeId: string) => Promise<Challenge>;
}
