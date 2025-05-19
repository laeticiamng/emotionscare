// Creating a placeholder types file for VR related types
// You may need to adjust this based on your actual types

export interface VRSessionTemplate {
  id: string;
  name: string;
  title?: string;
  description: string;
  duration: number;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  imageUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  preview_url?: string;
  difficulty?: string;
  benefits?: string[];
  audio_url?: string;
  audioTrack?: string;
  is_audio_only?: boolean;
  lastUsed?: string;
  theme?: string;
  rating?: number;
  popularity?: number;
  features?: string[];
  completionRate?: number;
  completion_rate?: number;
  emotionTarget?: string;
  emotion_target?: string;
  recommendedMood?: string;
  recommended_mood?: string;
  recommendedFor?: string[];
  environment?: string;
  environmentId?: string;
  immersionLevel?: string;
  goalType?: string;
  interactive?: boolean;
  intensity?: number;
  objective?: string;
  type?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  metrics?: {
    heartRate?: number[];
    focus?: number[];
    relaxation?: number[];
    stressLevel?: number;
    focusLevel?: number;
    emotionEnd?: string;
  };
  completed?: boolean;
  heartRateBefore?: number;
  heartRateAfter?: number;
  startedAt?: string;
  endedAt?: string;
  feedback?: {
    rating?: number;
    emotionBefore?: string;
    emotionAfter?: string;
    comment?: string;
  };
  template?: VRSessionTemplate;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onBack?: () => void;
  onStartSession?: () => void;
}

export interface VRSessionHistoryProps {
  sessions?: VRSession[];
  onSelect?: (session: VRSession | string) => void;
  onSessionSelect?: (session: VRSession | string) => void;
  emptyMessage?: string;
  limitDisplay?: number;
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete: () => void;
  musicEnabled?: boolean;
  backgroundMusic?: string;
  session?: any;
  sessionTemplate?: VRSessionTemplate;
  onExit?: () => void;
  environment?: string;
}
