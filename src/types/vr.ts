
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
  name?: string; // Added for backward compatibility
  audio_url?: string; // Added for backward compatibility
  audioTrack?: string; // Added for backward compatibility
  is_audio_only?: boolean; // Added for backward compatibility
  preview_url?: string; // Added for backward compatibility
  lastUsed?: Date | string; // Added for backward compatibility
  completed?: boolean; // Added for backward compatibility
  completionRate?: number; // Added for backward compatibility
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
  completed?: boolean; // Added for backward compatibility
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
  sessions?: VRSession[];
  onSelect?: (session: VRSession) => void;
  emptyMessage?: string;
  limitDisplay?: number;
}
