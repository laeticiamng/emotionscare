
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
}

export interface VRSessionWithMusicProps {
  session?: VRSessionTemplate;
  musicTracks?: any[];
  onSessionComplete: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  template?: VRSessionTemplate; // Add missing property
  onCompleteSession?: () => void; // Add missing property
}

export interface VREmotionRecommendationProps {
  emotion: any; // Fix for required emotion prop
}

// Add the properties used in VRPage.tsx
export interface VRSessionHookReturn {
  session: VRSession;
  isActive: boolean;
  duration: number;
  activeTemplate?: VRSessionTemplate;
  isSessionActive?: boolean;
  heartRate?: number;
  isLoading?: boolean;
  startSession: (templateId?: string | VRSessionTemplate, emotionBefore?: string) => VRSession;
  completeSession: (emotionAfter?: string) => VRSession;
  cancelSession: () => void;
  formatDuration: (seconds: number) => string;
}
