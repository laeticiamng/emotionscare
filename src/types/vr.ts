
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  categoryId?: string;
  videoUrl?: string;
  audioUrl?: string;
  audio_url?: string; // Backward compatibility
  preview_url?: string;
  benefits?: string[];
  difficulty?: string;
  tags?: string[];
  type?: string;
  category?: string;
  level?: string;
  rating?: number;
  featured?: boolean;
  name?: string; // Added for VRHistoryList, VRPromptWidget, VRRecommendations
  lastUsed?: string | Date; // Added for VRHistoryList
  is_audio_only?: boolean;
  emotion_target?: string; // Added for dashboard components
  emotionTarget?: string; // Alternative naming
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  start_time?: string | Date;
  end_time?: string | Date;
  date?: string | Date;
  completed: boolean;
  isCompleted?: boolean;
  duration: number;
  duration_seconds?: number;
  feedback?: string;
  rating?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  template?: VRSessionTemplate;
  startTime?: string | Date; // Added for compatibility
  heart_rate_before?: number;
  heart_rate_after?: number;
  heartRateBefore?: number;
  heartRateAfter?: number;
}

export interface VRHistoryListProps {
  limit?: number;
  userId?: string;
  onSessionSelect?: (session: VRSession) => void;
  className?: string;
  templates?: VRSessionTemplate[]; // Added for HistoryList component
  sessions?: VRSession[]; // Added for VRSessionHistory component
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  onSessionSelect?: (session: VRSession) => void;
  className?: string;
  sessions?: VRSession[]; // Added for compatibility
  showHeader?: boolean;
}

export interface VRSessionWithMusicProps {
  sessionId: string;
  templateId?: string;
  onComplete?: (sessionData: VRSession) => void;
  autoPlay?: boolean;
  className?: string;
}
