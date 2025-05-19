
export interface Badge {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  image_url?: string; // For backward compatibility
  level?: string;
  unlockedAt?: Date | string;
  unlocked_at?: Date | string; // For backward compatibility
  unlocked?: boolean;
  category?: string;
  threshold?: number;
}

export interface Challenge {
  id: string;
  name?: string;
  title: string;
  description: string;
  category?: string;
  points?: number;
  icon?: string;
  completed?: boolean;
  progress?: number;
  unlocked?: boolean;
  deadline?: Date | string;
  difficulty?: string;
  completions?: number;
  goal?: number;
  totalSteps?: number;
}
