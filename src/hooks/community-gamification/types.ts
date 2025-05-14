
import { Badge } from '@/types';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'completed' | 'failed' | 'locked' | 'ongoing' | 'active' | 'available';
  category: string;
  type?: string;
  progress?: number;
  goal?: number;
  icon?: string;
  startDate?: string;
  endDate?: string;
  level?: string | number;
}

export interface GamificationStats {
  currentLevel: number;
  totalPoints: number;
  badgesCount: number;
  streakDays: number;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  activeChallenges: number;
  completedChallenges: number;
  lastActivityDate?: string;
  nextLevelPoints?: number;
  recentAchievements?: any[];
}

export interface UseCommunityGamificationResult {
  stats: GamificationStats;
  badges: Badge[];
  challenges: Challenge[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
