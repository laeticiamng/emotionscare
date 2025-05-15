
// Types liés à la réalité virtuelle
export interface VRSessionTemplate {
  id: string;
  title: string;
  description?: string;
  duration: number;
  emotion?: string;
  tags?: string[];
  theme?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  audioUrl?: string;
  emotion_target?: string;
  emotionTarget?: string;
  difficulty?: string;
  benefits?: string[];
  thumbnailUrl?: string;
  category?: string;
  completionRate?: number;
  completion_rate?: number;
  recommendedMood?: string;
  recommended_mood?: string;
  name?: string;
  lastUsed?: string | Date;
  thumbnail?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  start_time: Date;
  end_time?: Date;
  completed: boolean;
  mood_before?: string;
  mood_after?: string;
  score?: number;
  notes?: string;
  date?: string;
  startedAt?: string;
  duration_seconds?: number;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
  isCompleted?: boolean;
  templateId?: string;
  userId?: string;
  startTime?: string | Date;
  endTime?: string | Date;
}

export interface VRHistoryListProps {
  userId?: string;
  limit?: number;
  showFilters?: boolean;
  templates?: VRSessionTemplate[];
  sessions?: VRSession[];
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  onSelectSession?: (session: VRSession) => void;
  loading?: boolean;
  onSelect?: (template: VRSessionTemplate) => void;
  title?: string;
  emptyMessage?: string;
  className?: string;
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
}

export interface VRTemplateGridProps {
  templates?: VRSessionTemplate[];
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  filter?: string;
  isLoading?: boolean;
}

export interface VRSessionWithMusicPropsType {
  template: VRSessionTemplate;
  onComplete?: (sessionData: VRSession) => void;
  onExit?: () => void;
}

export interface VRSessionHistoryProps {
  sessions?: VRSession[];
  isLoading?: boolean;
  onViewDetails?: (sessionId: string) => void;
}
