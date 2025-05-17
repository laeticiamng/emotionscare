
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  icon?: string;
  date_earned?: string;
  dateEarned?: string;
  earnedDate?: string;
  category?: string;
  type?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  threshold?: number;
  level?: number;
  unlocked?: boolean;
  achieved?: boolean;
  progress?: number;
  total?: number;
  maxProgress?: number;
  tier?: string;
}
