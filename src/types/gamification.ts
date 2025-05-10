
export interface GamificationStats {
  points: number;
  level: number;
  badges_earned: number;
  total_badges: number;
  current_streak: number;
  longest_streak: number;
  challenges_completed: number;
  next_challenge?: Challenge;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress?: number;
  total?: number;
  completed: boolean;
  deadline?: string | Date;
  badge_reward?: string;
}

export interface Leaderboard {
  timeframe: 'weekly' | 'monthly' | 'all_time';
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar?: string;
  points: number;
  rank: number;
  badges?: number;
  is_current_user?: boolean;
}
