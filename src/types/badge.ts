
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earned: boolean;
  earnedAt?: string;
  criteria?: string;
  progress?: number;
  threshold?: number;
  isNew?: boolean;
  category?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  total?: number;
  completed?: boolean;
  maxProgress?: number;
  // Compatibilité avec les autres composants
  image_url?: string;
  icon?: string;
  unlocked?: boolean;
  achieved?: boolean;
  unlockedAt?: string;
  unlocked_at?: string;
  dateEarned?: string;
  image?: string;
  icon_url?: string;
  level?: string | number;
  rarity?: string;
}

export interface BadgeCollection {
  earned: Badge[];
  available: Badge[];
}
