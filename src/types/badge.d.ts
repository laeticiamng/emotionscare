
export interface Badge {
  id: string;
  name?: string;
  title?: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  icon?: string;
  earned?: boolean;
  progress?: number;
  threshold?: number;
  tier?: string;
  level: number;
  category: string;
  unlocked: boolean;
  completed?: boolean;
  rarity?: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  score: number;
  rank: number;
  name?: string;
  avatar?: string;
  level?: number;
  badges?: number;
}
