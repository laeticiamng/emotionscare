
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
  achieved?: boolean;
  unlockedAt?: string;
  unlocked_at?: string;
}

export interface Challenge {
  id: string;
  title: string;
  name?: string;
  description: string;
  points: number;
  progress: number;
  goal: number;
  category: string;
  completed: boolean;
  status: string;
  totalSteps?: number;
  tags?: string[];
  difficulty?: string;
  completions?: number;
  total?: number;
  deadline?: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  points: number;
  rank: number;
  avatar?: string;
  name?: string;
  username?: string;
  score?: number;
}
