
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  earned: boolean;
  earned_at?: Date;
  progress?: number;
  total?: number;
}

export interface Level {
  level: number;
  title: string;
  points_required: number;
  benefits: string[];
  icon: string;
}

export interface UserGameStats {
  user_id: string;
  points: number;
  level: number;
  achievements_earned: number;
  streak_days: number;
  badges: string[];
  last_activity: Date;
}
