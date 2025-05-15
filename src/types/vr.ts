
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
  thumbnailUrl?: string;
  videoUrl?: string;
  video_url?: string;
  is_audio_only?: boolean;
  lastUsed?: string | Date;
  completionRate?: number;
  completion_rate?: number;
  recommendedMood?: string;
  recommended_mood?: string;
  templateId?: string;
  template_id?: string;
}

export interface VRSession {
  id: string;
  template_id: string;
  templateId?: string;
  user_id: string;
  userId?: string;
  start_time: string | Date;
  startTime?: string | Date;
  startedAt?: string;
  date?: string;
  end_time?: string | Date;
  endTime?: string | Date;
  duration?: number;
  duration_seconds?: number;
  completed?: boolean;
  isCompleted?: boolean;
  mood_before?: string;
  mood_after?: string;
  template?: VRSessionTemplate;
  emotion_before?: string;
  emotionBefore?: string;
  emotion_after?: string;
  emotionAfter?: string;
  emotionTarget?: string;
  emotion_target?: string;
  notes?: string;
  rating?: number;
  music_played?: boolean;
  heart_rate_before?: number;
  heartRateBefore?: number;
  heart_rate_after?: number;
  heartRateAfter?: number;
  settings?: {
    intensity?: number;
    volume?: number;
    visualEffects?: boolean;
  };
  completedAt?: string | Date;
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
  onSelect?: (template: VRSessionTemplate) => void;
  isLoading?: boolean;
  filter?: string;
}

// This type is needed as an export
export type VRSessionWithMusicPropsType = VRSessionWithMusicProps;
