
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

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  start_time: string | Date;
  end_time?: string | Date;
  duration_seconds?: number;
  completed: boolean;
  feedback?: {
    rating: number;
    comments?: string;
    emotion_before?: string;
    emotion_after?: string;
  };
  metrics?: {
    focus_score?: number;
    relaxation_score?: number;
    presence_score?: number;
  };
}
