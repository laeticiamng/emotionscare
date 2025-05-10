
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  unlocked: boolean;
  unlock_date?: string | Date;
  category?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  criteria?: string;
  progress?: number;
}
