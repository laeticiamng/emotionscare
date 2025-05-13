
import { Badge, Challenge } from '@/types/gamification';

export interface GamificationStats {
  level: number;
  points: number;
  nextLevelPoints: number;
  badges: Badge[];
  challenges: Challenge[];
  recentAchievements: {
    type: 'badge' | 'challenge' | 'level';
    id: string;
    name: string;
    timestamp: Date;
    points?: number;
  }[];
}

export interface UseChallengeManagementResult {
  activeChallenges: Challenge[];
  recommendedChallenges: Challenge[];
  acceptChallenge: (challengeId: string) => Promise<boolean>;
  completeChallenge: (challengeId: string) => Promise<boolean>;
  generatePersonalizedChallenges: (userEmotion?: string) => Promise<Challenge[]>;
}

export interface UseCommunityGamificationResult {
  stats: GamificationStats | null;
  isLoading: boolean;
  activeChallenges: Challenge[];
  recommendedChallenges: Challenge[];
  acceptChallenge: (challengeId: string) => Promise<boolean>;
  completeChallenge: (challengeId: string) => Promise<boolean>;
  generatePersonalizedChallenges: (userEmotion?: string) => Promise<Challenge[]>;
  refresh: () => Promise<void>;
}
