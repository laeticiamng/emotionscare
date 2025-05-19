
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  level: string | number; // Accept both string and number
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
  // Additional fields found in usage
  icon?: string;
  tier?: string;
  total?: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  imageUrl?: string;
  reward?: Badge | string;
  category?: string;
  expires?: string;
  unlocked?: boolean;
  // Adding fields needed by ChallengesList component
  title?: string;
  isCompleted?: boolean;
  goal?: number | string;
  totalSteps?: number;
  completions?: number;
  difficulty?: string;
  points?: number;
  deadline?: string;
  status?: string;
  icon?: string;
}
