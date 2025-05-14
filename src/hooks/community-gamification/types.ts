
import { Badge } from '@/types';

export interface GamificationStats {
  currentLevel: number;
  totalPoints: number;
  badgesCount: number;
  streakDays: number;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  activeChallenges: number;
  completedChallenges: number;
  lastActivityDate: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'completed' | 'ongoing' | 'failed' | 'locked';
  category: string;
  dueDate?: string;
  progressPercentage?: number;
}

export interface UseCommunityGamificationResult {
  stats: GamificationStats;
  badges: Badge[];
  challenges: Challenge[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export type { Badge };
