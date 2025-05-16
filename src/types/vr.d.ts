
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail_url?: string;
  thumbnailUrl?: string; // For compatibility
  tags?: string[];
  category?: string;
  vr_url?: string;
  emotion_target?: string;
  emotionTarget?: string; // For compatibility
  intensity?: number;
}

export interface VRSessionContextType {
  sessions: VRSessionTemplate[];
  currentSession: VRSessionTemplate | null;
  isPlaying: boolean;
  playSession: (session: VRSessionTemplate) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  loadSessionsForEmotion: (emotion: string) => Promise<VRSessionTemplate[]>;
  sessionProgress: number;
  sessionDuration: number;
  loading: boolean;
  error: string | null;
}

export interface VRPlayerProps {
  session?: VRSessionTemplate;
  autoPlay?: boolean;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
}

export interface VRControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  progress: number;
  duration: number;
}
