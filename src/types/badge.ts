
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
  completed?: boolean;
  rarity?: string; // Ajouté pour résoudre les erreurs
  title?: string; // Ajouté pour résoudre les erreurs
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
  name?: string; // Ajouté pour résoudre les erreurs
  avatar?: string;
  level?: number;
  badges?: number;
  username?: string;
  avatarUrl?: string;
  points?: number;
  streak?: number;
}
