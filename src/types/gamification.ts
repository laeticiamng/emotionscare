
export interface GamificationStats {
  totalPoints: number;
  totalBadges: number;
  completedChallenges: number;
  currentLevel: number;
  nextLevelPoints: number;
  progress: number;
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image?: string;
  unlocked: boolean;
  unlockedAt?: string;
  category?: string;
  level?: number;
  points?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress?: number;
  deadline?: string;
  category?: string;
  difficulty?: string;
  badge?: Badge;
}

export interface Period {
  value: string;
  label: string;
  days?: number;
}
