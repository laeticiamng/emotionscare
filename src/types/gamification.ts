
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category?: string;
  dateUnlocked?: string;
}

export interface GamificationStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  longestStreak: number;
  completedChallenges: number;
  totalChallenges: number;
  unlockedBadges: number;
  totalBadges: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  reward: number;
  progress: number;
  goal: number;
  completed: boolean;
  category: string;
  endDate?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  available: boolean;
  category: string;
  unlocked: boolean;
}
