
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  awarded_at?: string;
  user_id?: string;
  tier?: string;
  // Backward compatibility fields
  imageUrl?: string;
  date?: string;
  unlocked?: boolean;
  unlockedAt?: string;
  unlocked_at?: string;
  earned?: boolean;
  level?: number;
  completed?: boolean;
  threshold?: number;
}

export interface Challenge {
  id: string;
  name?: string;
  title?: string;
  description: string;
  points?: number;
  progress?: number;
  goal?: number;
  category?: string;
  completed?: boolean;
  status?: string;
  difficulty?: string;
  completions?: number;
  total?: number;
  deadline?: string;
  reward: any;
  unlocked: boolean;
  // Added for compatibility with different components
  totalSteps?: number;
  isCompleted?: boolean;
}

// Add LeaderboardEntry type for useCommunityGamification
export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  points: number;
  position: number;
  avatarUrl?: string;
  badges?: Badge[];
}
