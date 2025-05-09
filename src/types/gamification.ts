
// Gamification related types
import { User } from './index';

export interface Badge {
  id: string;
  title: string;
  description: string;
  image_url: string;
  criteria: string;
  category?: string;
  points?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked_at?: string;
  progress?: number;
  user_id?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total_steps?: number;
  category?: string;
  points?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'expired';
  points: number;
  deadline?: Date;
  requirements: string[];
  progress?: number;
  reward_badge_id?: string;
  user_id: string;
}

export interface Leaderboard {
  id: string;
  title: string;
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  users: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  user: User;
  rank: number;
  points: number;
  badges_count: number;
  streak_days: number;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  date: string;
  data: any;
  type: string;
  userId?: string;
  metadata?: Record<string, any>;
}
