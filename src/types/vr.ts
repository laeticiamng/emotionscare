
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number | string;
  category: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  audio_url?: string; // For backward compatibility
  audioTrack?: string; // For backward compatibility
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  emotion?: string;
  popularity?: number;
  name?: string; // For backward compatibility
  lastUsed?: string; // For tracking last usage
  environmentId?: string;
  intensity?: number;
  immersionLevel?: string;
  goalType?: string;
  interactive?: boolean;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  progress: number;
  completed: boolean;
  duration: number | string;
  createdAt?: string;
  feedback?: string;
  rating?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  notes?: string;
  startedAt?: string;
  endedAt?: string;
  startTime?: string; // For backward compatibility
  endTime?: string;   // For backward compatibility
  metrics?: Record<string, any>; // For storing various metrics
  heartRateBefore?: number;
  heartRateAfter?: number;
}

export interface VRSessionWithMusicProps {
  session?: VRSession;
  template?: VRSessionTemplate;
  sessionTemplate?: VRSessionTemplate; // For backward compatibility
  onComplete?: () => void;
  onExit?: () => void;
  environment?: string;
  musicEnabled?: boolean;
  backgroundMusic?: any;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
}

export interface VRTemplateDetailProps {
  templateId: string;
}
