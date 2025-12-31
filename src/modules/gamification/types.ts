/**
 * Types Gamification - EmotionsCare
 */

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  category: RewardCategory;
  rarity: RewardRarity;
  available: boolean;
  stock?: number;
  expiresAt?: string;
  claimedAt?: string;
}

export type RewardCategory = 'theme' | 'avatar' | 'boost' | 'content' | 'feature';
export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  pointsReward: number;
  progress: number;
  target: number;
  completed: boolean;
  expiresAt: string;
  category: ChallengeCategory;
}

export type ChallengeCategory = 'scan' | 'journal' | 'meditation' | 'social' | 'wellness';

export interface GamificationProgress {
  userId: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  totalPoints: number;
  streak: number;
  longestStreak: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  badgesEarned: number;
  totalBadges: number;
  challengesCompleted: number;
  rewardsClaimed: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: RewardRarity;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  points: number;
  level: number;
  streak: number;
  badges: string[];
  isCurrentUser?: boolean;
}

export interface GamificationNotification {
  id: string;
  type: 'achievement' | 'level_up' | 'streak' | 'challenge' | 'reward';
  title: string;
  description: string;
  icon: string;
  rarity?: RewardRarity;
  points?: number;
  xp?: number;
  timestamp: string;
  read: boolean;
}

export interface GamificationStats {
  totalXpEarned: number;
  totalPointsEarned: number;
  totalChallengesCompleted: number;
  totalAchievementsUnlocked: number;
  currentStreak: number;
  longestStreak: number;
  favoriteActivity: string | null;
  lastActivityDate: string | null;
  weeklyProgress: {
    day: string;
    xp: number;
    points: number;
  }[];
}
