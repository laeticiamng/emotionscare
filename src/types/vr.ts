
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // For backward compatibility
  description: string;
  duration: number;
  thumbnailUrl?: string;
  environmentId: string;
  category: string;
  intensity: number;
  objective: string;
  type: string;
  tags: string[];
  difficulty?: string;
  theme?: string;
  audio_url?: string;
  audioTrack?: string;
  is_audio_only?: boolean;
  lastUsed?: string | Date;
  preview_url?: string;
  benefits?: string[];
  imageUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  rating?: number;
  features?: string[];
  popularity?: number;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime?: string | Date;
  endTime?: string | Date;
  completed: boolean;
  emotionalScoreBefore?: number;
  emotionalScoreAfter?: number;
  notes?: string;
  metrics?: Record<string, any>;
  heartRateBefore?: number;
  heartRateAfter?: number;
  startedAt?: string | Date;
  date?: string | Date;
  duration?: number;
  template?: VRSessionTemplate; // Reference to the template
}

export interface VRSessionWithMusicProps {
  session?: VRSession;
  template?: VRSessionTemplate;
  onExit?: () => void;
  sessionId?: string;
  title?: string;
  description?: string;
  duration?: number;
  musicTrackId?: string;
  sessionTemplate?: VRSessionTemplate;
  onComplete?: () => void;
  environment?: string;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
  onSessionSelect?: (sessionId: string) => void;
  sessions?: VRSession[];
  onSelect?: (template: VRSessionTemplate | VRSession) => void;
  emptyMessage?: string;
  limitDisplay?: number;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onBack?: () => void;
  onStartSession?: () => void;
  className?: string;
}
