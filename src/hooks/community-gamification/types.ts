
import { Badge, Challenge, GamificationStats } from '@/types/gamification';

export interface ChallengeProgressUpdatePayload {
  challengeId: string;
  progress: number;
}

export interface UseChallengeManagementResult {
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  updateChallengeProgress: (payload: ChallengeProgressUpdatePayload) => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface UseCommunityGamificationResult {
  stats: GamificationStats;
  badges: Badge[];
  challenges: Challenge[];
  badges_count?: number;
  completed_challenges?: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  claimBadge: (badgeId: string) => Promise<void>;
}

export { Badge, Challenge }; // Re-export these types
