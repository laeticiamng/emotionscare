
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  imageUrl?: string; // Alternative property
  category?: string;
  unlocked?: boolean;
  unlockedAt?: string;
  unlocked_at?: string; // Alternative property
  date?: string;
  level?: number;
  earned?: boolean;
  earnedDate?: string;
  threshold?: number;
  completed?: boolean;
  progress?: number;
  total?: number;
  icon?: string;
  rarity?: string;
}

export interface Challenge {
  id: string;
  title: string;
  name?: string; // Alternative property
  description: string;
  reward: string;
  progress: number;
  total: number;
  category: string;
  unlocked: boolean;
  completed?: boolean;
  isCompleted?: boolean;
  goal?: number;
  totalSteps?: number;
  completions?: number;
  difficulty?: string;
  points?: number;
  deadline?: string;
  threshold?: number;
  status?: 'completed' | 'failed' | 'locked' | 'ongoing' | 'active' | 'available' | 'in-progress';
  icon?: string;
}
