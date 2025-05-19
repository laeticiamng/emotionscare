
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // Adding backward compatibility for name
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
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onBack?: () => void;
  onStartSession?: () => void;
}
