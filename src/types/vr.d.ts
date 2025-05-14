export interface VRSessionTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
  emotion?: string;
  emotions?: string[];
  type?: string;
  category?: string;
  authorId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isPublic?: boolean;
  usageCount?: number;
  rating?: number;
  
  // Additional properties needed by VR components
  title?: string;
  theme?: string;
  audio_url?: string;
  preview_url?: string;
  is_audio_only?: boolean;
  emotion_target?: string;
  benefits?: string[];
  difficulty?: string;
  lastUsed?: string | Date;
  completion_rate?: number;
  recommended_mood?: string;
  tags?: string[];
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: Date | string;
  endTime?: Date | string;
  duration?: number;
  mood?: {
    before?: string;
    after?: string;
  };
  feedback?: string;
  isCompleted?: boolean;
  
  // Additional properties for backwards compatibility
  user_id?: string;
  template_id?: string;
  startedAt?: string | Date;
  date?: string | Date;
  duration_seconds?: number;
  completed?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
  is_audio_only?: boolean;
  template?: VRSessionTemplate;
  emotion_before?: string;
  emotion_after?: string;
}

export interface VRHistoryListProps {
  sessions?: VRSession[];
  isLoading?: boolean;
  onSessionClick?: (session: VRSession) => void;
  showEmptyState?: boolean;
}

export interface VRSessionWithMusicProps {
  sessionId: string;
  templateId?: string;
  onComplete?: () => void;
  onCancel?: () => void;
  
  // Additional properties needed by components
  template?: VRSessionTemplate;
  session?: VRSession;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
