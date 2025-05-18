
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  user_id: string;
  awarded_at: Date | string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  completed?: boolean;
}

export interface BadgeCategory {
  id: string;
  name: string;
  description: string;
  badges: Badge[];
}

export interface BadgeContextType {
  badges: Badge[];
  addBadge: (badge: Badge) => void;
  removeBadge: (badgeId: string) => void;
  isLoading: boolean;
  error: Error | null;
}
