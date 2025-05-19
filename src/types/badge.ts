
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  category?: string;
  level?: number;
  achieved?: boolean;
  progress?: number;
  maxProgress?: number;
  dateAwarded?: string;
  unlockCriteria?: string;
  xp?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}
