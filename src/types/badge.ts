
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  category?: string;
  unlocked?: boolean;
  date?: string;
  level?: number;  // Added to match usage in mockBadges.ts
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  total: number;
  category: string;
  unlocked: boolean;
}
