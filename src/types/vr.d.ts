
export interface VRSessionTemplate {
  id: string;
  name: string;
  description?: string;
  duration: number;
  type: string;
  thumbnail?: string;
  videoUrl?: string;
  emotion?: string;
  
  // Add missing properties that are used
  title?: string;
  audio_url?: string;
  emotion_target?: string;
  lastUsed?: string | Date;
  preview_url?: string;
  is_audio_only?: boolean;
  benefits?: string[];
  difficulty?: string;
  theme?: string;
  tags?: string[]; // Add tags property
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  isCompleted: boolean;
  emotionBefore?: string;
  emotionAfter?: string;
  notes?: string;
  rating?: number;
  
  // Add missing properties that are used
  date?: string;
  startedAt?: string;
  duration_seconds?: number;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
}

export interface VRHistoryListProps {
  templates: VRSessionTemplate[];
  sessions: VRSession[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
  onSelectSession: (session: VRSession) => void;
  loading?: boolean;
}

// Update VRSessionWithMusicProps
export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  session?: VRSession;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
