
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
  category?: string; // Add category for compatibility
  achieved?: boolean; // Add achieved property for GamificationSummaryCard
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  goal: number;
  points: number;
  status: string;
  reward: any;
  unlocked: boolean;
}
