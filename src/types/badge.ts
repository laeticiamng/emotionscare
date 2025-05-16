
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  icon?: string;
  date_earned?: string;
  dateEarned?: string;
  category?: string;
  type?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  threshold?: number;
  level?: number;
}
