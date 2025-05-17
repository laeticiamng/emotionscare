
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | string | number;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  unlocked_at?: string; // For compatibility
  progress?: number;
  total?: number;
  image?: string;
  imageUrl?: string;
  image_url?: string; // For compatibility
  requirements?: {
    description: string;
    progress: number;
    goal: number;
  }[];
  achieved?: boolean;
  threshold?: number;
  // Properties added for compatibility
  earned?: boolean;
  earnedAt?: string;
  dateEarned?: string;
  tier?: string;
  completed?: boolean;
  rarity?: string;
  title?: string;
}

export interface BadgeCollection {
  userId: string;
  badges: Badge[];
  totalUnlocked: number;
  recentlyUnlocked: Badge[];
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
  username?: string;
  avatarUrl?: string;
  points?: number;
  streak?: number;
  trend?: string;
}
