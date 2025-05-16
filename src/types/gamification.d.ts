
export interface GamificationStats {
  points: number;
  level: number;
  streak: number;
  daysActive: number;
  totalChallenges: number;
  completedChallenges: number;
  rank: number;
  nextLevelPoints: number;
  nextLevelProgress: number;
  badges: Badge[];
  unlockedBadges: Badge[];
  weeklyProgress: number;
  activeDays: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  progress?: number;
  expires_at?: string;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  icon?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlocked: boolean;
  progress?: number;
  unlock_date?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  rank: number;
  avatar?: string;
  isCurrentUser?: boolean;
  streak?: number;
}

export interface GamificationContextType {
  stats: GamificationStats;
  challenges: Challenge[];
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  completeChallenge: (id: string) => Promise<void>;
  resetStreak: () => Promise<void>;
  incrementStreak: () => Promise<void>;
  addPoints: (points: number) => Promise<void>;
  refreshStats: () => Promise<void>;
}
