
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  level?: number;
  unlocked?: boolean;
  category?: string;
  progress?: number;
  unlockedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  completed: boolean;
  deadline?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  iconUrl?: string;
}

export interface GamificationStats {
  points: number;
  level: number;
  nextLevelPoints: number;
  rank: number;
  streak: number;
  nextLevel: number;
  achievements: Badge[];
  badges: Badge[];
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel: number;
  challenges: Challenge[];
  recentAchievements: Badge[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  position: number;
  avatar?: string;
  badges?: Badge[]; // Added to fix TS error
}
