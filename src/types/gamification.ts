
import { User } from './user';

export interface GamificationStats {
  points: number;
  level: number;
  badges: number;
  rank?: string;
  streak?: number;
  completedChallenges?: number;
  totalChallenges?: number;
  nextLevel?: {
    points: number;
    level: number;
    progress: number;
  };
  progress?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  threshold?: number;
  type?: string;
  imageUrl?: string;
  image_url?: string;
  unlocked?: boolean;
  category?: string;
  level?: string | number;
  points?: number;
  user_id?: string;
  icon_url?: string;
  total_required?: number;
  image?: string;
  dateEarned?: string;
  awarded_at?: Date | string;
  unlockedAt?: Date | string; // Add for compatibility
  progress?: number; // Add for compatibility
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  deadline?: string;
  completed?: boolean;
  complete?: boolean; // Add for compatibility
  progress?: number;
  category?: string;
  icon?: string;
  difficulty?: string;
  requiredCount?: number;
  currentCount?: number;
  imageUrl?: string;
}

export interface Period {
  id: string;
  name: string;
  value: string;
  label: string;
}

export interface LeaderboardEntry {
  id: string;
  user: User | string;
  userId?: string;
  user_id?: string;
  rank: number;
  points: number;
  level?: number;
  avatarUrl?: string;
  avatar_url?: string;
  name?: string;
  change?: number;
  trend?: 'up' | 'down' | 'same';
}

export interface GamificationSettings {
  enabled: boolean;
  showPoints: boolean;
  showLeaderboard: boolean;
  showAchievements: boolean;
  showChallenges: boolean;
  notificationsEnabled: boolean;
}
