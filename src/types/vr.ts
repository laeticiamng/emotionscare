
export interface VRSessionTemplate {
  id: string;
  title: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  coverUrl?: string; 
  cover_url?: string;
  preview_url?: string;
  duration: number;
  difficulty: string;
  category: string;
  audioUrl?: string;
  audio_url?: string;
  audioTrack?: string;
  tags?: string[];
  isFeatured?: boolean;
  rating?: number;
  features?: string[];
  environment?: string;
  environmentId?: string;
  immersionLevel?: string;
  lastUsed?: string | Date;
  goalType?: string;
  intensity?: number | string;
  interactive?: boolean;
  thumbnail?: string;
  theme?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: Date | string;
  endTime?: Date | string;
  startedAt?: Date | string;
  endedAt?: Date | string;
  createdAt?: Date | string;
  duration: number;
  completed: boolean;
  progress?: number;
  feedback?: VRSessionFeedback;
  notes?: string;
  heartRateBefore?: number;
  heartRateAfter?: number;
  metrics?: {
    heartRate?: number | number[];
    stressLevel?: number;
    focusLevel?: number;
    [key: string]: any;
  };
}

export interface VRSessionFeedback {
  id: string;
  sessionId: string;
  userId: string;
  rating: number;
  comment?: string;
  emotions?: Record<string, number>;
  timestamp: Date | string;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  session?: VRSession;
  sessionTemplate?: VRSessionTemplate;
  onComplete?: (session?: VRSession) => void;
  onExit?: () => void;
  musicEnabled?: boolean;
  backgroundMusic?: string;
  environment?: string;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStart?: () => void;
  onBack?: () => void;
}

export interface VRSessionPlayerProps {
  session: VRSession;
  template: VRSessionTemplate;
  onComplete?: () => void;
  onExit?: () => void;
}

export interface VRSessionHistoryProps {
  sessions: VRSession[];
  onSelect?: (session: VRSession) => void;
  emptyMessage?: string;
  limitDisplay?: number;
  showHeader?: boolean;
  className?: string;
  onSessionSelect?: (session: VRSession) => void;
}

export type VRDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
