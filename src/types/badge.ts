
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlock_requirements: string;
  unlocked_at?: string;
  progress?: number;
}
