
export interface VRSessionTemplate {
  id?: string;
  title: string;
  name?: string; // For backward compatibility
  description?: string;
  duration: number;
  audio_url?: string;
  videoUrl?: string;
  emotion_target?: string;
  emotion?: string;
  is_audio_only?: boolean;
  lastUsed?: string;
  completion_rate?: number;
  recommended_mood?: string;
  templateId?: string;
  emotions?: string[];
  benefits?: string[];
  difficulty?: string;
  tags?: string[]; // Added for UserDashboardSections
  theme?: string;
  preview_url?: string;
}

export interface VRSession {
  id: string;
  userId?: string;
  templateId?: string;
  date?: string;
  startDate?: string;
  startedAt?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  duration_seconds?: number;
  is_audio_only?: boolean;
  completed?: boolean;
  isCompleted?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
}

export interface VRHistoryListProps {
  userId: string;
  limit?: number;
  showHeading?: boolean;
  className?: string;
}

export interface VRSessionWithMusicProps {
  session?: VRSessionTemplate;
  template?: VRSessionTemplate;
  onSessionComplete?: () => void;
  onComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
}
