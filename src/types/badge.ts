
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  unlocked?: boolean;
  level?: number;
  tier?: string;
  progress?: number;
  threshold?: number;
  completed?: boolean;
  unlockedAt?: string;
  unlocked_at?: string;
  date?: string;
  category?: string;
  achieved?: boolean;
  earned?: boolean;
  rarity?: string;
  icon?: string;
}

export interface Challenge {
  id: string;
  title: string;
  name?: string;
  description: string;
  progress: number;
  goal: number;
  points: number;
  status: string;
  reward: any;
  unlocked: boolean;
  category?: string;
  difficulty?: string;
  completions?: number;
  total?: number;
  totalSteps?: number;
  deadline?: string;
  completed?: boolean;
  isCompleted?: boolean;
  icon?: string;
}
