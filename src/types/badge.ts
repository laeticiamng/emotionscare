
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  total?: number;
  image?: string;
  imageUrl?: string;
  requirements?: {
    description: string;
    progress: number;
    goal: number;
  }[];
}

export interface BadgeCollection {
  userId: string;
  badges: Badge[];
  totalUnlocked: number;
  recentlyUnlocked: Badge[];
}
