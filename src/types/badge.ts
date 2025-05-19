
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
}
