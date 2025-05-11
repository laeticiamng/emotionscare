
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
  level?: number;
  unlocked?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  requirements: string[];
  completed?: boolean;
  progress?: number;
  deadline?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  level?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  total?: number;
  completed?: boolean;
}
