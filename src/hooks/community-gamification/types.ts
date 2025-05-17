
import { Badge } from '@/types/badge';
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

// Export types avec "export type" pour corriger l'erreur isolatedModules
export type { Badge };
export type { Challenge, LeaderboardEntry };
