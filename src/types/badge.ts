
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earned: boolean;
  earnedAt?: string;
  criteria?: string;
  progress?: number;
  isNew?: boolean;
  category?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  // Compatibilité avec les autres composants
  image_url?: string;
  icon?: string;
  unlocked?: boolean;
  achieved?: boolean;
  unlockedAt?: string;
  unlocked_at?: string;
  dateEarned?: string;
  image?: string;
  threshold?: number;
  completed?: boolean;
  total?: number;
  maxProgress?: number;
  icon_url?: string;
}

export interface BadgeCollection {
  earned: Badge[];
  available: Badge[];
}
