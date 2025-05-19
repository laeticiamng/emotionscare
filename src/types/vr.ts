
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  difficulty: string;
  category: string;
  tags: string[];
  immersionLevel: string;
  goalType: string;
  interactive: boolean;
  // Additional properties for compatibility
  environment?: string;
  environmentId?: string;
  imageUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  preview_url?: string;
  audioUrl?: string;
  audio_url?: string;
  audioTrack?: string;
  theme?: string;
  is_audio_only?: boolean;
  benefits?: string[];
  features?: string[];
  lastUsed?: string;
  rating?: number;
  popularity?: number;
  completionRate?: number;
  completion_rate?: number;
  emotionTarget?: string;
  emotion_target?: string;
  recommendedMood?: string;
  recommended_mood?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  metrics?: Record<string, any>;
  // Additional properties for compatibility
  completed?: boolean;
  heartRateBefore?: number;
  heartRateAfter?: number;
  duration_seconds?: number;
  duration?: number;
}

export interface VRSessionWithMusicProps {
  sessionId?: string;
  onComplete?: () => void;
  // Additional properties for compatibility
  template?: VRSessionTemplate;
  session?: VRSession;
  sessionTemplate?: VRSessionTemplate;
  onExit?: () => void;
  environment?: string;
  musicEnabled?: boolean;
  backgroundMusic?: any;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  // Additional properties for compatibility
  sessions?: VRSession[];
  onSelect?: (session: VRSession) => void;
  emptyMessage?: string;
  limitDisplay?: number;
  showHeader?: boolean;
  className?: string;
  onSessionSelect?: (session: VRSession) => void;
}

export interface VRTemplateDetailProps {
  templateId: string;
  onStart?: (template: VRSessionTemplate) => void;
}
