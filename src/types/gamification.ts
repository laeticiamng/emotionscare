
// Gamification related types
import { User, Badge } from './index';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  badge_id?: string;
  badge?: Badge;
  start_date: string;
  end_date?: string;
  requirements: ChallengeRequirement[];
  participants?: number;
  completion_rate?: number;
  is_featured?: boolean;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  user_progress?: UserChallengeProgress;
}

export interface ChallengeRequirement {
  id: string;
  challenge_id: string;
  type: 'count' | 'duration' | 'streak' | 'specific';
  activity: string;
  target_value: number;
  description?: string;
  custom_validation?: string;
}

export interface UserChallengeProgress {
  user_id: string;
  challenge_id: string;
  started_at: string;
  completed_at?: string;
  current_value: number;
  target_value: number;
  percentage: number;
  last_activity_at?: string;
  requirements_progress?: Record<string, number>;
}

export interface Leaderboard {
  id: string;
  title: string;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  category?: string;
  entries: LeaderboardEntry[];
  last_updated: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  change?: number;
  previous_rank?: number;
  achievements?: string[];
}
