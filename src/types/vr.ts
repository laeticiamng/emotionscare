
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: number;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  environment: string;
  created_at: string | Date;
  updated_at: string | Date;
  is_premium: boolean;
}
