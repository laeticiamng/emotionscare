
export interface VRSessionTemplate {
  id: string;
  name?: string;
  title: string;
  description?: string;
  duration: number;
  type?: string;
  thumbnail?: string;
  videoUrl?: string;
  emotion?: string;
  
  // Add missing properties that are used
  audio_url?: string;
  audioUrl?: string;
  emotion_target?: string;
  emotionTarget?: string;
  lastUsed?: string | Date;
  preview_url?: string;
  is_audio_only?: boolean;
  isAudioOnly?: boolean;
  benefits?: string[];
  difficulty?: string;
  theme?: string;
  tags?: string[];
  imageUrl?: string;
  thumbnailUrl?: string;
  coverUrl?: string;
  video_url?: string;
  recommendedMood?: string;
  completionRate?: number;
}

export interface VRSession {
  id: string;
  templateId?: string;
  template_id?: string;
  userId?: string;
  user_id?: string;
  startTime?: string;
  endTime?: string;
  startedAt?: string;
  started_at?: string;
  completedAt?: string;
  completed_at?: string;
  completed?: boolean;
  isCompleted?: boolean;
  duration: number;
  duration_seconds?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  emotion_before?: string;
  emotion_after?: string;
  notes?: string;
  rating?: number;
  
  // Add missing properties that are used
  date?: string;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
  heartRateBefore?: number;
  heartRateAfter?: number;
  start_time?: string;
  end_time?: string;
  emotionTarget?: string;
  emotion_target?: string;
  template?: VRSessionTemplate;
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

// This type is needed as an export
export type VRSessionWithMusicPropsType = VRSessionWithMusicProps;

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
  sessions?: VRSession[];
}
