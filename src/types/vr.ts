
// Types for VR-related components
export * from './index';

export interface VRSessionStats {
  total: number;
  completed: number;
  averageRating: number;
  totalDuration: number;
  byCategory: Record<string, number>;
  byEmotion?: Record<string, number>;
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  started_at: Date | string;
  completed_at?: Date | string;
  duration: number;
  rating?: number;
  notes?: string;
  emotion_before?: string;
  emotion_after?: string;
  music_track_id?: string;
}

export interface VRSessionTemplate {
  id: string;
  template_id?: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  image_url?: string;
  preview_url?: string;
  theme?: string;
  audio_url?: string;
  is_audio_only?: boolean;
  benefits?: string[];
  emotions?: string[];
  popularity?: number;
  recommended_emotions?: string[];
  recommended_music?: string[];
  instructions?: string[];
  coach_guidance?: string;
  session_prompts?: string[];
  isNew?: boolean;
  isRecommended?: boolean;
}
