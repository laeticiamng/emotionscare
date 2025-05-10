
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  image_url?: string;
  unlocked: boolean;
  unlock_date?: Date | string;
  requirements?: string;
  category?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}
