export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  level?: number;
  progress?: number;
  image?: string;
  imageUrl?: string;
  category?: string;
  dateEarned?: string;
  isNew?: boolean;
  criteria?: string;
  unlocked?: boolean;
  earned?: boolean;
  tier?: string;
  rarity?: string;
  goal?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  icon?: string;
  completed?: boolean;
  progress?: number;
  deadline?: string;
  category?: string;
  difficulty?: string;
  reward?: string;
  goal?: number;
  status?: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  username: string;
  points: number;
  rank: number;
  avatar?: string;
  score: number;
}
