
import { Badge, Challenge } from '@/types/gamification';

// Re-export for convenience
export type { Badge, Challenge };

export interface GamificationStats {
  points: number;
  level: number;
  nextLevelPoints: number;
  badges: Badge[];
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel: number;
  challenges: Challenge[];
  recentAchievements: any[];
}

export interface UseCommunityGamificationResult {
  stats: GamificationStats;
  badges: Badge[];
  challenges: Challenge[];
  badges_count: number;
  completed_challenges: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  claimBadge: (badgeId: string) => Promise<void>;
}
