
export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName?: string;
  name?: string;
  avatar?: string;
  score: number;
  rank: number;
  team?: string;
  department?: string;
  level?: number;
  badges?: number | string[];
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
  // Propriétés additionnelles pour la compatibilité
  totalChallenges?: number;
  streakDays?: number;
  longestStreak?: number;
  xp?: number;
  xpToNextLevel?: number;
}

export * from './badge';
export * from './challenges';
