
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  level?: number;
  progress?: number;
  maxProgress?: number;
  unlocked?: boolean;
  achieved_at?: string | Date;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  seen?: boolean;
}
