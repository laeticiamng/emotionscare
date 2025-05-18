
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  unlocked: boolean;
  level: number;
  category: string;
  tier?: string;
  icon?: string;
  earned?: boolean;
  progress?: number;
  threshold?: number;
  completed?: boolean;
  rarity?: string;
}

export interface Challenge {
  id: string;
  title: string;
  name?: string; // Added to satisfy type requirements
  description: string;
  points: number;
  progress: number;
  goal: number;
  category: string;
  completed: boolean;
  status: string;
  totalSteps?: number;
  tags?: string[]; // Added to satisfy import requirements
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  points: number;
  rank: number;
  avatar?: string;
  name?: string;
}
