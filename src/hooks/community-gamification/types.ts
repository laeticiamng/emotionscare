
import { Badge } from '@/types/user';
import { User } from '@/types/user';

// Export the Challenge interface
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  category: string;
  status?: string;
  progress?: number;
  completedAt?: string;
  completed?: boolean;
  icon?: string;
  duration?: string;
  requirements?: string[];
}

export interface Achievement {
  id: string;
  name: string;
  icon?: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
  description?: string;
}

export interface GamificationStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalChallengesCompleted: number;
  streak: number;
  badges: number;
  rank?: string;
  percentile?: number;
  lastActivityDate?: string;
}

export interface UseCommunityGamificationResult {
  isProcessing: boolean;
  error: string;
  markChallengeCompleted: (challengeId: string) => Promise<Challenge>;
  trackChallengeProgress: (challengeId: string, progress: number) => Promise<Challenge>;
  achievements: Achievement[];
  stats: GamificationStats;
  activeChallenges: Challenge[];
  recommendedChallenges: Challenge[];
  acceptChallenge: (challengeId: string) => Promise<Challenge>;
  generatePersonalizedChallenges: () => Promise<Challenge[]>;
  completeChallenge: (challengeId: string) => Promise<Challenge>;
  badges: Badge[];
}

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
  type?: string;
}

