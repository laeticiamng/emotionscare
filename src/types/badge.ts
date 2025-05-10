
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  awarded_at?: Date | string;
  icon?: string;
  unlocked?: boolean;
  level?: string | number;
  threshold?: number;
  points?: number;
  user_id?: string;
  icon_url?: string;
  total_required?: number;
  category?: string;
}
