
// Types liés à la réalité virtuelle
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // Pour compatibilité
  description: string;
  thumbnailUrl: string;
  thumbnail?: string; // Pour compatibilité
  duration: number;
  category: string;
  tags: string[];
  completionRate: number;
  completion_rate?: number; // Pour compatibilité
  recommendedMood: string;
  recommended_mood?: string; // Pour compatibilité
  emotionTarget?: string;
  emotion_target?: string; // Pour compatibilité
  popularity?: number;
  difficulty?: string;
  intensity?: number;
  imageUrl?: string;
  preview_url?: string;
  is_audio_only?: boolean;
  audio_url?: string;
  audioUrl?: string;
  benefits?: string[];
  theme?: string;
  emotion?: string;
  lastUsed?: string | Date;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  duration: number;
  heartRateBefore: number;
  heartRateAfter: number;
  emotionBefore?: string;
  emotionAfter?: string;
  emotionTarget?: string;
  notes?: string;
  rating?: number;
  startTime?: string; // Pour compatibilité
  endTime?: string;
  date?: string;
  duration_seconds?: number;
  completed?: boolean;
  isCompleted?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
  started_at?: string;
  is_audio_only?: boolean;
}

export interface VRHistoryListProps {
  userId?: string;
  limit?: number;
  onSessionClick?: (session: VRSession) => void;
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
  session?: VRSession;
  template?: VRSessionTemplate;
  onComplete?: (sessionData?: VRSession) => void;
  onExit?: () => void;
  autoplay?: boolean;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
}

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  filter?: string;
  featuredOnly?: boolean;
  limit?: number;
  className?: string;
}

// Type utilisé pour la compatibilité 
export type VRSessionWithMusicPropsType = VRSessionWithMusicProps;
