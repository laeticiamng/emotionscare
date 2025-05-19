
// Add VR related types here
export interface VRSessionTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  difficulty: string;
  category: string;
  tags: string[];
  immersionLevel: string;
  goalType: string;
  interactive: boolean;
  benefits?: string[];
  environmentId?: string;
  environment?: string;
  theme?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  audioTrack?: string;
  lastUsed?: string;
  imageUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  rating?: number;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  rating?: number;
  feedback?: string;
  heartRateBefore?: number;
  heartRateAfter?: number;
  completed?: boolean;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  session?: VRSession;
  sessionTemplate?: VRSessionTemplate;
  onComplete?: () => void;
  onExit?: () => void;
  environment?: string;
  musicEnabled?: boolean;
  backgroundMusic?: string;
}

export interface VRSessionHistoryProps {
  sessions?: VRSession[];
  showHeader?: boolean;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStartSession?: () => void;
  heartRate?: number;
  onBack?: () => void;
}
