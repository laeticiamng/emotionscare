
export interface LeaderboardEntry {
  id: string;
  user_id: string;
  displayName: string;
  avatar?: string;
  score: number;
  rank: number;
  team?: string;
  department?: string;
  level?: number;
  badges?: string[];
  position?: number; // Pour compatibilité
}

export interface GamificationStats {
  points: number;
  level: number;
  badges: number;
  challenges: number;
  streak: number;
  rank?: number;
  position?: number;
  completedChallenges?: number;
  activeChallenges?: number;
  totalBadges?: number;
  unlockedBadges?: number;
}

export * from './badge';
export * from './challenges';
