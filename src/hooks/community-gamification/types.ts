
import { Challenge, Badge as GamificationBadge } from '@/types/gamification';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: Date | string;
  level?: number;
  image?: string;
  category?: string;
}

export interface ActivityData {
  totalActivity: number;
  recentActivities: Activity[];
  activityByDay: Record<string, number>;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date | string;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  image?: string;
  unlocked: boolean;
}

export interface GamificationContext {
  stats: GamificationStatsState;
  challenges: ChallengeState;
  rewards: RewardState;
}

export interface GamificationStatsState {
  isLoading: boolean;
  error: string | null;
  data: GamificationStats | null;
}

export interface ChallengeState {
  isLoading: boolean;
  error: string | null;
  data: Challenge[] | null;
  current: Challenge | null;
}

export interface RewardState {
  isLoading: boolean;
  error: string | null;
  data: RewardItem[] | null;
}

export interface GamificationStats {
  points: number;
  level: number;
  nextLevelPoints: number;
  badges: GamificationBadge[];
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel: number;
  challenges: Challenge[];
  recentAchievements: GamificationBadge[];
  totalPoints?: number;
}
