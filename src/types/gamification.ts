
export interface GamificationStats {
  score: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  longestStreak: number;
  activeChallenges: number;
  completedChallenges: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  goal: number;
  completed: boolean;
  deadline?: string;
  category: string;
  icon?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked?: boolean;
  unlockedAt?: string;
  category?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  goal?: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  score: number;
  rank: number;
  change?: number;
}
