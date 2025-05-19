
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  icon_url?: string;
  tier?: string;
  unlocked?: boolean;
  completed?: boolean;
  unlockedAt?: Date | string;
  unlocked_at?: Date | string; // For backward compatibility
  progress?: number;
  threshold?: number;
}

export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  completed?: boolean;
  progress?: number;
  goal?: number;
  total?: number; // For backward compatibility
  totalSteps?: number;
  completions?: number;
  deadline?: Date | string;
  points: number;
}
