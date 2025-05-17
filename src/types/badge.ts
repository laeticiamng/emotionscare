
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earned: boolean;
  earnedAt?: string;
  criteria?: string;
  progress?: number;
  isNew?: boolean;
  category?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface BadgeCollection {
  earned: Badge[];
  available: Badge[];
}
