
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  icon?: string;
  level?: number;
  progress?: number;
  unlocked?: boolean;
  achieved_at?: string | Date;
}
