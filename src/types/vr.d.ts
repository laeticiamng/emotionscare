
export interface VRSessionTemplate {
  id: string;
  title: string;
  description?: string;
  duration: number;
  tags?: string[];
  theme?: string;
  environment?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  vr_url?: string;
  thumbnailUrl?: string;
  emotionTarget?: string;
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  started_at: Date | string;
  completed_at?: Date | string;
  duration_seconds: number;
  emotion_before?: string;
  emotion_after?: string;
  notes?: string;
  rating?: number;
}

export interface VRProgress {
  sessionsCompleted: number;
  minutesSpent: number;
  favoriteEnvironment?: string;
  lastSession?: Date | string;
  streak: number;
}
