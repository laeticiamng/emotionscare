
export interface VRSessionTemplate {
  id: string;
  name: string;
  description?: string;
  duration: number; // in seconds
  emotions?: string[];
  intensity?: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  
  // Additional properties needed by components
  title?: string;
  theme?: string;
  audio_url?: string; // For backwards compatibility
  preview_url?: string; // For backwards compatibility
  is_audio_only?: boolean;
  emotion_target?: string;
  benefits?: string[];
  difficulty?: string;
  lastUsed?: string | Date;
  completion_rate?: number;
  recommended_mood?: string;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  template?: VRSessionTemplate;
  startedAt: string;
  completedAt?: string;
  duration: number;
  emotion?: string;
  intensity?: number;
  feedback?: string;
  
  // For backwards compatibility
  user_id?: string;
  template_id?: string;
  startTime?: string | Date;
  endTime?: string | Date;
  duration_seconds?: number;
  isCompleted?: boolean;
  completed?: boolean;
  emotion_before?: string;
  emotion_after?: string;
  heart_rate_before?: number;
  heart_rate_after?: number;
  date?: string | Date;
  start_time?: string | Date;
  is_audio_only?: boolean;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  onComplete?: () => void;
  session?: VRSession;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
  onCancel?: () => void;
}

export interface VRHistoryListProps {
  sessions?: VRSession[];
  isLoading?: boolean;
  onSessionClick?: (session: VRSession) => void;
  showEmptyState?: boolean;
}
