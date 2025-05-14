
import { GamificationStats, Badge, Challenge } from '@/types/gamification';

export interface UseCommunityGamificationResult {
  stats: GamificationStats;
  badges: Badge[];
  challenges: Challenge[];
  badges_count: number;
  completed_challenges: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  claimBadge: (badgeId: string) => Promise<void>;
}

export type { Badge, Challenge, GamificationStats };
