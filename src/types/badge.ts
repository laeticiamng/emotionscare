
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  category?: string;
  level?: number | string;
  achieved?: boolean;
  progress?: number;
  maxProgress?: number;
  dateAwarded?: string;
  unlockCriteria?: string;
  xp?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  
  // Additional properties to ensure compatibility
  unlocked?: boolean;
  unlockedAt?: string;
  unlocked_at?: string;
  image?: string;
  timestamp?: string;
  icon?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  earned?: boolean;
  threshold?: number;
  completed?: boolean;
}

export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  category?: string;
  goal: number | string;
  points?: number;
  progress?: number;
  completed?: boolean;
  status?: string;
  totalSteps?: number;
  unlocked?: boolean;
  reward?: any;
  difficulty?: string;
  completions?: number;
  total?: number;
  deadline?: string;
  type?: string;
  isCompleted?: boolean;
  icon?: string;
  value?: any;
  tags?: string[];
}
