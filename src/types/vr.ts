
// Creating a placeholder types file for VR related types
// You may need to adjust this based on your actual types

export interface VRSessionTemplate {
  id: string;
  name: string;
  title?: string; // Added for compatibility
  description: string;
  duration: number;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  imageUrl?: string; // Added for compatibility
  coverUrl?: string; // Added for compatibility
  cover_url?: string; // Added for compatibility
  preview_url?: string; // Added for compatibility
  difficulty?: string; // Added for compatibility
  benefits?: string[]; // Added for compatibility
  audio_url?: string; // Added for compatibility
  audioTrack?: string; // Added for compatibility
  is_audio_only?: boolean; // Added for compatibility
  lastUsed?: string; // Added for compatibility
  theme?: string; // Added for compatibility
  rating?: number; // Added for compatibility
  popularity?: number; // Added for compatibility
  features?: string[]; // Added for compatibility
  completionRate?: number; // Added for compatibility
  completion_rate?: number; // Added for compatibility
  emotionTarget?: string; // Added for compatibility
  emotion_target?: string; // Added for compatibility
  recommendedMood?: string; // Added for compatibility
  recommended_mood?: string; // Added for compatibility
  recommendedFor?: string[]; // Added for compatibility
  environment?: string; // Added for compatibility
  immersionLevel?: string; // Added for compatibility
  goalType?: string; // Added for compatibility
  interactive?: boolean; // Added for compatibility
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
  completed?: boolean; // Added for compatibility
  heartRateBefore?: number; // Added for compatibility
  heartRateAfter?: number; // Added for compatibility
  startedAt?: string; // Added for compatibility
  endedAt?: string; // Added for compatibility
  feedback?: {
    rating?: number;
    emotionBefore?: string;
    emotionAfter?: string;
    comment?: string;
  };
  template?: VRSessionTemplate; // Added for compatibility
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onBack?: () => void;
  onStartSession?: () => void; // Added missing property
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
}
