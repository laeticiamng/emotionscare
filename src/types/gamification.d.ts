
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  level?: number;
  unlockedAt?: string;
  progress?: number;
  completed?: boolean;
  unlocked?: boolean; // For compatibility
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  icon: string;
  progress: number;
  deadline?: string;
  completed?: boolean;
  failed?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  position: number;
  avatar?: string;
  badges?: Badge[];
  username?: string;
  userId?: string;
}

export interface GamificationStats {
  points: number;
  level: number;
  streak: number;
  nextLevel: {
    points: number;
    level: number;
  };
  progress: number;
  badges?: Badge[];
  completedChallenges?: number;
  totalChallenges?: number;
  challenges?: Challenge[];
  rank?: number;
  xp?: number;
}
