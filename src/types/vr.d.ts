
export interface VRSessionTemplate {
  id: string;
  name?: string;
  description?: string;
  duration: number;
  type?: string;
  thumbnail?: string;
  videoUrl?: string;
  emotion?: string;
  
  // Add missing properties that are used
  title: string;
  audio_url?: string;
  emotion_target?: string;
  lastUsed?: string | Date;
  preview_url?: string;
  is_audio_only?: boolean;
  benefits?: string[];
  difficulty?: string;
  theme?: string;
  tags?: string[];
  imageUrl?: string;
  thumbnailUrl?: string;
  video_url?: string;
  emotionTarget?: string;
  recommendedMood?: string;
  completionRate?: number;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  completed: boolean;
  emotionBefore?: string;
  emotionAfter?: string;
  notes?: string;
  rating?: number;
  
  // Add missing properties that are used
  date?: string;
  startedAt?: string;
  duration_seconds?: number;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
  isCompleted?: boolean;
  template_id?: string;
  user_id?: string;
  start_time?: string;
  end_time?: string;
  emotionTarget?: string;
  emotion_target?: string;
  heartRateBefore?: number;
  heartRateAfter?: number;
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
}
