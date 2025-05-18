
/**
 * Gamification Types
 * --------------------------------------
 * This file defines the official types for gamification functionality.
 * Any new property or correction must be documented here and synchronized across all mockData and components.
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string; // Official property name
  icon_url?: string; // Legacy property
  earnedAt?: string; // Official property for when badge was earned
  earned_at?: string; // Legacy property
  category: string;
  level: number;
  isUnlocked: boolean;
  is_unlocked?: boolean; // Legacy property
  requirements?: string[];
  points?: number;
  dateEarned?: string; // Deprecated - use earnedAt instead
  achieved?: boolean; // Used by some components
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  completedAt?: string;
  progress: number; // 0-100
  isCompleted: boolean;
  reward?: {
    type: string;
    value: number;
    description: string;
  };
}

export interface GamificationProfile {
  userId: string;
  level: number;
  points: number;
  badges: Badge[];
  achievements: Achievement[];
  streaks: {
    current: number;
    longest: number;
    lastActive: string;
  };
  challenges: {
    active: number;
    completed: number;
    total: number;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  progress: number; // 0-100
  isCompleted: boolean;
  startDate: string;
  endDate?: string;
  requirements: string[];
}

export interface GamificationStats {
  points: number;
  level: number;
  badges: number;
  achievements: number;
  currentStreak: number;
  activeChallenges: number;
}
