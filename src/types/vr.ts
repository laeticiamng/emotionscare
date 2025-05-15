
export interface VRSessionTemplate {
  id: string;
  title: string;
  description?: string;
  emotion?: string;
  duration?: number;
  difficulty?: string;
  benefits?: string[];
  preview_url?: string;
  theme?: string;
  is_audio_only?: boolean;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  preview?: string;
  audio_url?: string;
  audioUrl?: string;
  category?: string;
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  completed?: boolean;
  emotion_target?: string;
  emotionTarget?: string;
  emotion_before?: string;
  emotionBefore?: string;
  emotion_after?: string;
  emotionAfter?: string;
  notes?: string;
  heart_rate_before?: number;
  heartRateBefore?: number;
  heart_rate_after?: number;
  heartRateAfter?: number;
  stress_level_before?: number;
  stressLevelBefore?: number;
  stress_level_after?: number;
  stressLevelAfter?: number;
  completed_at?: string;
  completedAt?: string;
  template?: VRSessionTemplate;
}

export interface VRHistoryListProps {
  sessions?: VRSession[];
  isLoading?: boolean;
  onSessionClick?: (session: VRSession) => void;
}

export interface VRSessionWithMusicProps {
  session: VRSession;
  onComplete?: (data: any) => void;
  onExit?: () => void;
  autoStart?: boolean;
}

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  isLoading?: boolean;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  onSessionClick?: (session: VRSession) => void;
}
