
import { MusicTrack, MusicPlaylist } from './music';

export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // For backward compatibility 
  description: string;
  thumbnailUrl: string;
  thumbnail?: string; // For backward compatibility
  duration: number;
  category: string;
  tags: string[];
  completionRate: number;
  completion_rate?: number; // For backward compatibility
  recommendedMood: string;
  recommended_mood?: string; // For backward compatibility
  emotionTarget?: string; // Added for components expecting this
  emotion_target?: string; // For backward compatibility
  popularity?: number;
  difficulty?: string;
  intensity?: number;
  imageUrl?: string;
  // Adding properties expected by components
  preview_url?: string;
  is_audio_only?: boolean;
  audio_url?: string;
  benefits?: string[];
  theme?: string;
  emotion?: string; // Added for compatibility
  lastUsed?: string | Date;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  duration: number;
  heartRateBefore: number;
  heartRateAfter: number;
  emotionBefore?: string;
  emotionAfter?: string;
  emotionTarget?: string;
  notes?: string;
  rating?: number;
  // Adding properties expected by components
  startTime?: string;
  date?: string;
  duration_seconds?: number;
  completed?: boolean;
  isCompleted?: boolean;
  heart_rate_before?: number; // For backward compatibility
  heart_rate_after?: number; // For backward compatibility
  started_at?: string; // For backward compatibility
}

export interface VRHistoryListProps {
  userId?: string;
  limit?: number;
  onSessionClick?: (session: VRSession) => void;
  templates?: VRSessionTemplate[];
  sessions?: VRSession[];
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  onSelectSession?: (session: VRSession) => void;
  loading?: boolean;
}

export interface VRSessionWithMusicProps {
  session?: VRSession;
  template?: VRSessionTemplate;
  onComplete?: (sessionData?: VRSession) => void;
  onExit?: () => void;
  autoplay?: boolean;
  // Adding properties expected by components
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
  onSelect: (template: VRSessionTemplate) => void;
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  filter?: string;
  featuredOnly?: boolean;
  limit?: number;
  className?: string;
}
