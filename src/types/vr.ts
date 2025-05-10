
export interface VRSessionTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  thumbnail_url?: string;
  duration: number; // in seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  emotion_target?: string;
  instructions?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  user_rating?: number;
  times_completed?: number;
  audio_url?: string;
  image_urls?: string[];
  environment_id?: string;
}
