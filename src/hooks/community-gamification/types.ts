
import { Badge } from '@/types/gamification';
import { Challenge, LeaderboardEntry } from '@/types/gamification';

export interface GamificationStats {
  points: number;
  level: number;
  rank: string;
  badges: Badge[];
  streak: number;
  nextLevelPoints: number;
  progress: number;
  recentAchievements?: Badge[];
}

// Export types with "export type" to fix the isolatedModules error
export type { Badge };
export type { Challenge, LeaderboardEntry };
