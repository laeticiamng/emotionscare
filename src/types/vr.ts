
export interface VRSessionTemplate {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  benefits?: string[];
  category?: string;
  level?: string;
  difficulty?: string;
  type?: string;
  tags?: string[];
  imageUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  preview_url?: string;
  audio_url?: string;
  previewUrl?: string;
  audioUrl?: string;
  emotion?: string;
  theme?: string;
  emotionTarget?: string;
  emotion_target?: string;
  name?: string;
  thumbnail?: string;
  videoUrl?: string;
  video_url?: string;
  is_audio_only?: boolean;
  lastUsed?: string | Date;
  completionRate?: number;
  recommendedMood?: string;
  thumbnailUrl?: string;
  templateId?: string;
  template_id?: string;
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  start_time: string | Date;
  end_time?: string | Date;
  duration?: number;
  completed?: boolean;
  mood_before?: string;
  mood_after?: string;
  template?: VRSessionTemplate;
  emotion_before?: string;
  emotion_after?: string;
  notes?: string;
  rating?: number;
  music_played?: boolean;
  settings?: {
    intensity?: number;
    volume?: number;
    visualEffects?: boolean;
  };
  
  // Add missing properties that are used
  startTime?: string;
  startedAt?: string;
  date?: string;
  duration_seconds?: number;
  heart_rate_before?: number;
  heart_rate_after?: number;
  heartRateBefore?: number;
  heartRateAfter?: number;
  isCompleted?: boolean;
  templateId?: string;
  emotionBefore?: string;
  emotionAfter?: string;
  emotionTarget?: string;
}

export interface VRHistoryListProps {
  templates?: VRSessionTemplate[];
  sessions?: VRSession[];
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  onSelectSession?: (session: VRSession) => void;
  loading?: boolean;
  onSelect?: (template: VRSessionTemplate) => void;
  title?: string;
  emptyMessage?: string;
  className?: string;
  limit?: number;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  onComplete?: (sessionData: VRSession) => void;
  onExit?: () => void;
  
  // Add missing properties
  session?: VRSession;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
  musicEnabled?: boolean;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onTemplateClick?: (template: VRSessionTemplate) => void;
  isLoading?: boolean;
}
