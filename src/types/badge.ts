
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  unlocked_at?: string; // Pour compatibilité
  progress?: number;
  total?: number;
  image?: string;
  imageUrl?: string;
  image_url?: string; // Pour compatibilité
  requirements?: {
    description: string;
    progress: number;
    goal: number;
  }[];
  achieved?: boolean;
  threshold?: number;
  // Propriétés additionnelles pour la compatibilité
  earned?: boolean;
  earnedAt?: string;
  tier?: string;
}

export interface BadgeCollection {
  userId: string;
  badges: Badge[];
  totalUnlocked: number;
  recentlyUnlocked: Badge[];
}
