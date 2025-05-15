
export interface GamificationStats {
  total_scans: number;
  streak_days: number;
  points: number;
  level: number;
  next_milestone: number;
  badges_earned: string[];
  highest_emotion: string;
  emotional_balance: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  image_url?: string;
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
  category?: string;
  points?: number;
  criteria?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'active' | 'completed' | 'failed' | 'upcoming';
  progress?: number;
  deadline?: string;
  category?: string;
  icon?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  criteria?: string;
  reward?: any;
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  position: number;
  avatar?: string;
  badges?: any[];
}
