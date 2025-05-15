
export interface GamificationStats {
  level: number;
  points: number;
  next_milestone: number;
  streak_days: number;
  total_scans: number;
  emotional_balance: number;
  badges_earned: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: string;
  earned_at?: string;
  progress?: number;
  required?: number;
  category?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress?: number;
  total?: number;
  icon?: string;
  end_date?: string;
  category?: string;
}

export type Period = 'day' | 'week' | 'month' | 'year' | string;

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  change?: number;
  avatar?: string;
}
