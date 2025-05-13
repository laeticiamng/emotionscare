
import { Badge, Challenge, GamificationStats as BaseGamificationStats } from '@/types/gamification';

export interface GamificationStats extends BaseGamificationStats {
  challenges: Challenge[];
  recentAchievements: Badge[];
}

export interface UseCommunityGamificationResult {
  stats: GamificationStats;
  isLoading: boolean;
  activeChallenges: Challenge[];
  recommendedChallenges: Challenge[];
  generatePersonalizedChallenges: () => Promise<void>;
  acceptChallenge: (challengeId: string) => Promise<boolean>;
  completeChallenge: (challengeId: string) => Promise<boolean>;
  refresh: () => void;
}
