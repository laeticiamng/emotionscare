
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  unlocked: boolean;
  level?: number;
  category?: string;
  tier?: string;
  icon?: string;
  progress?: number;
  total?: number;
  user_id?: string;
  awarded_at?: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  points: number;
  progress?: number;
  total?: number;
  completed?: boolean;
  deadline?: string;
  imageUrl?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  badge_id?: string;
  user_id?: string;
}
