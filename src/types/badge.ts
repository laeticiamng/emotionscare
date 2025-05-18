
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  unlocked: boolean;
  unlocked_at?: string;
  unlockedAt?: string;
  level?: number;
  category?: string;
  tier?: string;
  icon?: string;
  progress?: number;
  total?: number;
  user_id?: string;
  awarded_at?: string;
  achieved?: boolean;
  earned?: boolean;
  threshold?: number;
}

export interface Challenge {
  id: string;
  name: string;
  title?: string;
  description: string;
  points: number;
  progress?: number;
  goal?: number;
  total?: number;
  totalSteps?: number;
  completed?: boolean;
  deadline?: string;
  imageUrl?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  badge_id?: string;
  user_id?: string;
  status?: string;
  completions?: number;
}
