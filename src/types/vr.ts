
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  environment: string;
  coverUrl?: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  recommended?: boolean;
  theme?: string;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: Date | string;
  endTime?: Date | string;
  duration: number;
  emotionBefore?: string;
  emotionAfter?: string;
  notes?: string;
  template?: VRSessionTemplate;
}

export interface VRSessionWithMusicProps {
  session?: VRSession;
  template?: VRSessionTemplate;
  onComplete?: (data: any) => void;
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
