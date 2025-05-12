
export interface VRSessionTemplate {
  id: string;
  name: string;
  description?: string;
  duration: number; // in seconds
  emotions?: string[];
  intensity?: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  template?: VRSessionTemplate;
  startedAt: string;
  completedAt?: string;
  duration: number;
  emotion?: string;
  intensity?: number;
  feedback?: string;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  onComplete?: () => void;
  session?: VRSession;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
