
export interface VRSession {
  id: string;
  user_id?: string;
  name?: string;
  title?: string;
  created_at?: Date;
  started_at?: Date;
  completed_at?: Date;
  duration?: number;
  description?: string;
  type?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scene_id?: string;
  emotion_before?: string;
  emotion_after?: string;
  score?: number;
  feedback?: string;
  favorite?: boolean;
  is_audio_only?: boolean;
  audio_url?: string;
  progress?: number;
  template_id?: string;
  
  // Champs nécessaires pour la compatibilité
  date?: string | Date;
  start_time?: string | Date;
  duration_seconds?: number;
  heart_rate_before?: number;
  heart_rate_after?: number;
  mood_before?: string;
  mood_after?: string;
  completed?: boolean;
  recommended_mood?: string;
}

export interface VRSessionTemplate {
  id: string;
  title: string;
  description?: string;
  duration: number;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  preview_url?: string;
  emotion_target?: string;
  intensity?: number;
  is_premium?: boolean;
  is_audio_only?: boolean;
  audio_url?: string;
  is_featured?: boolean;
  level?: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  created_at?: Date;
  
  // Champs supplémentaires pour la compatibilité
  name?: string;
  theme?: string;
  template_id?: string;
  completion_rate?: number;
  recommended_mood?: string;
  emotions?: string[];
  benefits?: string[];
  popularity?: number;
  difficulty?: string;
}

export interface VRSessionWithMusicProps {
  session?: VRSessionTemplate;
  musicTracks?: any[];
  onSessionComplete: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  template?: VRSessionTemplate;
  onCompleteSession?: () => void;
}

export interface VREmotionRecommendationProps {
  emotion: string | Emotion | null;
}

// Ajout des propriétés utilisées dans VRPage.tsx
export interface VRSessionHookReturn {
  session: VRSession;
  isActive: boolean;
  duration: number;
  activeTemplate?: VRSessionTemplate;
  isSessionActive?: boolean;
  heartRate?: {
    before: number;
    after: number;
  };
  isLoading?: boolean;
  startSession: (templateId?: string | VRSessionTemplate, emotionBefore?: string) => VRSession;
  completeSession: (emotionAfter?: string) => VRSession;
  cancelSession: () => void;
  formatDuration: (seconds: number) => string;
}
