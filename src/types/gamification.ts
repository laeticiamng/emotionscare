
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
  user_id?: string;
  unlocked_at?: string;
  progress?: number;
  unlocked?: boolean;
  icon_url?: string;
  level?: number;
  category?: string;
}

export interface Challenge {
  id: string;
  name: string;
  title: string;
  description: string;
  points: number;
  progress?: number;
  completed?: boolean;
  icon?: string;
  image_url?: string;
  total?: number;
  category?: string;
  difficulty?: string;
}

export interface UserScore {
  id: string;
  user_id: string;
  score: number;
  level: number;
  streak_days: number;
  longest_streak: number;
  badges_count: number;
  challenges_completed: number;
  last_activity: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  icon: string;
  available: boolean;
}

export interface GamificationAction {
  id: string;
  name: string;
  points: number;
  description: string;
  max_daily?: number;
}
