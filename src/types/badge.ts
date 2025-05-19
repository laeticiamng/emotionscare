
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  awarded_at?: string;
  user_id?: string;
  tier?: string; // Added for compatibility with useCommunityGamification
}

export interface Challenge {
  id: string;
  name: string;
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
  reward: any; // Added for type compatibility
  unlocked: boolean; // Added for type compatibility
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
