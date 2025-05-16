
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name or URL
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category?: string;
  dateUnlocked?: string;
}
