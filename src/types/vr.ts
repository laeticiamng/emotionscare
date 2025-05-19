
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  creator?: string;
  createdAt?: string;
  updatedAt?: string;
  popularity?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  theme?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime?: string;
  endTime?: string;
  duration: number;
  completed: boolean;
  emotionalStateAfter?: string;
  emotionalStateBefore?: string;
  notes?: string;
}

export interface VRSessionWithMusicProps {
  session?: VRSession;
  template?: VRSessionTemplate;
  onExit?: () => void;
  sessionId?: string;
  title?: string;
  description?: string;
  duration?: number;
  environment?: string;
  musicTrackId?: string;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
  onSessionSelect?: (session: VRSession) => void;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onStartSession?: () => void;
  onBack?: () => void;
}
