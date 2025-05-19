
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // Pour compatibilité avec l'ancien code
  description: string;
  duration: number;
  thumbnailUrl?: string;
  imageUrl?: string; // Pour compatibilité
  coverUrl?: string; // Pour compatibilité
  cover_url?: string; // Pour compatibilité
  preview_url?: string; // Pour compatibilité
  category: string;
  environment?: string;
  environmentId?: string;
  tags?: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  intensity?: number | string;
  immersionLevel?: string;
  goalType?: string;
  interactive?: boolean;
  audioUrl?: string;
  audio_url?: string; // Pour compatibilité
  audioTrack?: string; // Pour compatibilité
  completionRate?: number;
  completion_rate?: number; // Pour compatibilité
  emotionTarget?: string;
  emotion_target?: string; // Pour compatibilité
  emotion?: string; // Pour compatibilité
  recommendedMood?: string;
  recommended_mood?: string; // Pour compatibilité
  createdAt?: string;
  lastUsed?: string; // Pour historique
  rating?: number;
  features?: string[];
  theme?: string;
}

export interface VRSessionFeedback {
  rating: number;
  emotionBefore: string;
  emotionAfter: string;
  comment: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  progress: number;
  completed: boolean;
  duration: number | string;
  createdAt?: string;
  startedAt?: string;
  startTime?: string; // Pour compatibilité
  endedAt?: string;
  endTime?: string; // Pour compatibilité
  feedback?: string | VRSessionFeedback;
  rating?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  heartRateBefore?: number;
  heartRateAfter?: number;
  metrics?: Record<string, any>;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  sessionTemplate?: VRSessionTemplate; // Pour compatibilité
  session?: VRSession;
  onComplete?: () => void;
  onExit?: () => void;
  environment?: string;
  musicEnabled?: boolean;
  backgroundMusic?: string;
}

export interface VRSessionHistoryProps {
  sessions?: VRSession[];
  onSelect?: (session: VRSession) => void;
  emptyMessage?: string;
  limitDisplay?: number;
  showHeader?: boolean;
  className?: string;
  onSessionSelect?: (session: VRSession) => void;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onStart?: () => void;
  onBack?: () => void;
}
