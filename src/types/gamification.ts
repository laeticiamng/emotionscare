
export interface Achievement {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  category: string;
  unlocked: boolean;
  progress?: number;
  unlocked_at?: Date | string;
}

export interface Level {
  id: number;
  name: string;
  min_points: number;
  max_points: number;
  image_url?: string;
}

export interface UserProgress {
  user_id: string;
  points: number;
  level: number;
  achievements: string[]; // achievement ids
  current_streak: number;
  longest_streak: number;
  last_activity?: Date | string;
}
