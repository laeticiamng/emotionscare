
export interface GamificationStats {
  points: number;
  level: number;
  streak_days: number;
  completed_challenges: number;
  badges_earned: Badge[];
  next_milestone: {
    points_needed: number;
    reward: string;
  };
  progress_percentage: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  category?: string;
  earned_at?: string | Date;
  progress?: number;
  max_progress?: number;
  level?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  max_progress: number;
  completed: boolean;
  category?: string;
  icon?: string;
  end_date?: string | Date;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';
