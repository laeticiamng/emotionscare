
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  unlocked_at?: Date | string;
  progress?: number;
  total?: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  progress: number;
  total: number;
  completion_date?: Date | string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Level {
  level: number;
  name: string;
  points_required: number;
  benefits: string[];
}

export interface UserProgress {
  current_points: number;
  current_level: number;
  points_to_next_level: number;
  badges: Badge[];
  challenges: Challenge[];
}
