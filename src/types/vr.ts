
export interface VRSessionTemplate {
  id: string;
  name?: string;
  description?: string;
  duration: number; // Now properly defined as number
  type?: string;
  thumbnail?: string;
  videoUrl?: string;
  emotion?: string;
  
  // Add missing properties that are used
  title: string;
  audio_url?: string;
  emotion_target?: string;
  emotionTarget?: string;
  lastUsed?: string | Date;
  preview_url?: string;
  is_audio_only?: boolean;
  benefits?: string[];
  difficulty?: string;
  theme?: string;
  tags?: string[];
  imageUrl?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  completed: boolean;
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
  isCompleted?: boolean;
}

export interface VRHistoryListProps {
  templates?: VRSessionTemplate[];
  sessions?: VRSession[];
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  onSelectSession?: (session: VRSession) => void;
  loading?: boolean;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  onComplete?: (sessionData: VRSession) => void;
  onExit?: () => void;
  
  // Add missing properties
  session?: VRSession;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
}

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
  isLoading?: boolean;
}

// Define additional interface for VRSessionTemplate with emotionTarget
export interface VRSessionWithTarget extends VRSessionTemplate {
  emotionTarget?: string;
  emotion_target?: string;
}
