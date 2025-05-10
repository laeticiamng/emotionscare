
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: string;
  earned_at?: string | Date;
  progress?: number;
  user_id?: string;
}
