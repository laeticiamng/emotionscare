
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

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  started_at: string | Date;
  completed_at?: string | Date;
  duration: number;
  emotion_before?: string;
  emotion_after?: string;
  rating?: number;
  feedback?: string;
  template?: VRSessionTemplate;
}
