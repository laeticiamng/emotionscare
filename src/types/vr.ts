
export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startDate: Date | string;
  duration: number;
  completed: boolean;
  emotion?: string;
  template?: VRSessionTemplate; // Added for compatibility
}

export interface VRSessionTemplate {
  id?: string;
  name?: string;
  title?: string;
  theme?: string;
  duration: number;
  audio_url?: string;
  videoUrl?: string;
  preview_url?: string;
  emotion_target?: string;
  emotion?: string;
  is_audio_only?: boolean;
  lastUsed?: string;
  completion_rate?: number;
  recommended_mood?: string;
  templateId?: string;
  description?: string;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  session?: { 
    template?: VRSessionTemplate;
    templateId?: string;
  };
  onComplete?: () => void;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
}

export interface VRHistoryListProps {
  userId: string;
  limit?: number;
  onSessionSelect?: (session: VRSession) => void;
}
