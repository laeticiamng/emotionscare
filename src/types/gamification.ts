
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

export * from './challenges';
