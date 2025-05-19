
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // For backward compatibility
  description: string;
  duration: number;
  thumbnailUrl: string;
  imageUrl?: string; // For backward compatibility
  coverUrl?: string;
  cover_url?: string; // For backward compatibility
  category: string;
  environmentId: string;
  intensity: number;
  objective: string;
  type: string;
  tags: string[];
  benefits?: string[];
  features?: string[];
  rating?: number;
  popularity?: number;
  lastUsed?: Date | string;
  is_audio_only?: boolean;
  audio_url?: string;
  audioTrack?: string;
  preview_url?: string;
  theme?: string;
  difficulty?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  duration: number;
  completed?: boolean;
  startedAt?: Date | string;
  startTime?: Date | string;
  date?: Date | string;
  completedAt?: Date | string;
  template?: VRSessionTemplate;
  notes?: string;
  metrics?: {
    calmness?: number;
    focus?: number;
    energy?: number;
    happiness?: number;
    relaxation?: number;
    [key: string]: number | undefined;
  };
  heartRateBefore?: number;
  heartRateAfter?: number;
}

export interface VRSessionWithMusicProps {
  sessionTemplate?: VRSessionTemplate;
  session?: VRSession;
  template?: VRSessionTemplate;
  onComplete?: () => void;
  onExit?: () => void;
  sessionId?: string;
  title?: string;
  description?: string;
  duration?: number;
  environment?: string;
  className?: string;
}

export interface VRSessionHistoryProps {
  sessions: VRSession[];
  onSelect?: (session: VRSession) => void;
  onSessionSelect?: (session: VRSession) => void;
  emptyMessage?: string;
  limitDisplay?: number;
  limit?: number;
  userId?: string;
  showHeader?: boolean;
  className?: string;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStartSession?: () => void;
  onBack?: () => void;
  heartRate?: number;
}
