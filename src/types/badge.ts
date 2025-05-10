
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: 'engagement' | 'achievement' | 'milestone' | 'special';
  criteria: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earned_at?: Date;
  progress?: number;
  total?: number;
}
