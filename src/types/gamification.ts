
export interface Badge {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  level?: number;
  unlocked?: boolean;
  unlocked_at?: string | Date;
  progress?: number;
  total_required?: number;
  xp_reward?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}
