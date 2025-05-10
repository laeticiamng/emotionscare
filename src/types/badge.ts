
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  level: number;
  requirements: string[];
  awarded_at?: string | Date;
  progress?: number;
  total_required?: number;
  image_url?: string;
}
