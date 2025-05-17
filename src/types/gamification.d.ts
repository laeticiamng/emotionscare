
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string; // Pour compatibilité
  emoji?: string;
  level?: number; // Pour compatibilité avec mockData
  completed?: boolean; // Pour compatibilité avec useGamification
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  progress: number;
  completed?: boolean;
  points?: number;
  totalSteps?: number; // Pour compatibilité
}

export interface GamificationStats {
  level: number;
  points: number;
  progress: number;
  nextLevel: number;
  pointsToNextLevel: number;
  badges?: Badge[]; // Pour compatibilité
  activeChallenges?: Challenge[]; // Pour compatibilité
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatarUrl?: string;
  userId?: string; // Pour compatibilité
  trend?: 'up' | 'down' | 'stable'; // Pour compatibilité
}
