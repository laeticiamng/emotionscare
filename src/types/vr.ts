
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
  audio_url?: string; // Add missing fields used in VRAudioSession
  audioTrack?: string;
  is_audio_only?: boolean;
  lastUsed?: string | Date;
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
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
  onSessionSelect?: (sessionId: string) => void;
  sessions?: VRSession[];
  onSelect?: (template: VRSessionTemplate) => void;
  emptyMessage?: string;
  limitDisplay?: number;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onBack?: () => void;
  onStartSession?: () => void;
}
