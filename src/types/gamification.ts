
// Gamification related types

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  start_date?: string;
  end_date?: string;
  is_completed?: boolean;
  progress?: number;
  icon?: string;
  reward_badge_id?: string;
}

export interface UserProgress {
  user_id: string;
  level: number;
  experience: number;
  points: number;
  streak_days: number;
  badges_count: number;
  challenges_completed: number;
  rank?: number;
  next_level_threshold?: number;
  progress_percentage?: number;
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  avatar?: string;
  anonymity_code?: string;
  position: number;
  score: number;
  delta?: number;
  team?: string;
}
