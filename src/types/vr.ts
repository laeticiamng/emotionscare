
export interface VRSessionTemplate {
  id: string;
  name: string;
  title?: string;
  description: string;
  duration: number;
  tags?: string[];
  category: string;
  thumbnailUrl?: string;
  intensity: number;
  objective: string;
  type: string;
  // Adding these fields to fix type errors
  audio_url?: string;
  audioTrack?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  benefits?: string[];
  difficulty?: string;
  lastUsed?: Date | string;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: Date | string;
  endTime?: Date | string;
  duration?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  notes?: string;
  completed?: boolean;
  feedback?: string;
  // Adding these fields to fix type errors
  startedAt?: Date | string;
  completedAt?: boolean | Date | string;
  date?: Date | string;
  rating?: number;
  heartRateBefore?: number;
  heartRateAfter?: number;
  metrics?: {
    calm?: number;
    focus?: number;
    energy?: number;
  };
}

export interface VRSessionWithMusicProps {
  session: VRSession;
  template?: VRSessionTemplate;
  onComplete?: (feedback: string) => void;
  onExit?: () => void;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStartSession: () => void;
  onBack: () => void;
  heartRate?: number;
}

// Adding missing interface
export interface VRSessionHistoryProps {
  sessions: VRSession[];
  onSessionSelect?: (session: VRSession) => void;
}
