
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  unlockCriteria?: string;
  points?: number;
  unlocked?: boolean;
  unlockedAt?: string;
  progress?: number;
  // Compatibility fields
  earned?: boolean;
  rarity?: string;
  icon?: string;
  total?: number;
  level?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  unlocked: boolean;
  // Compatibility fields
  name?: string;
  points?: number;
  progress?: number;
  goal?: number;
  category?: string;
  completed?: boolean;
  isCompleted?: boolean;
  status?: string;
  difficulty?: string;
  completions?: number;
  total?: number;
  totalSteps?: number;
  icon?: string;
  deadline?: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  points: number;
  rank: number;
  // Compatibility fields
  level?: string;
  progress?: number;
  lastActive?: string;
}
