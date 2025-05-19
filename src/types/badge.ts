
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  level: string;
  unlocked?: boolean;
  unlockedAt?: string;
  category?: string;
  rarity?: string;
  progress?: number;
  threshold?: number;
  completed?: boolean;
  // Backward compatibility fields
  image_url?: string;
  date?: string;
  unlocked_at?: string;
  achieved?: boolean;
  earned?: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  imageUrl?: string;
  reward?: Badge;
  category?: string;
  expires?: string;
  // Adding fields needed by ChallengesList component
  title?: string;
  isCompleted?: boolean;
  goal?: number;
  totalSteps?: number;
  completions?: number;
  difficulty?: string;
  points?: number;
  deadline?: string;
  status?: string;
}
