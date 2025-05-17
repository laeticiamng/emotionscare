
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  icon: string;
  threshold?: number;
  earned?: boolean;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: string;
  unlocked: boolean;
  progress?: number;
  earnedAt?: string;
  achieved?: boolean;
  tier?: string;
  image?: string;
}
