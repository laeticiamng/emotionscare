
import { MusicTrack, MusicPlaylist } from './music';

export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // For backward compatibility 
  description: string;
  thumbnailUrl: string;
  duration: number;
  category: string;
  tags: string[];
  completionRate: number;
  recommendedMood: string;
  emotionTarget?: string; // Added for components expecting this
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
}

export interface VRSessionWithMusicProps {
  session?: VRSession;
  template?: VRSessionTemplate;
  onComplete?: () => void;
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
  filter?: string;
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  featuredOnly?: boolean;
  limit?: number;
}
