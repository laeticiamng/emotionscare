
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
  completionRate: number; // Standardized to camelCase
  recommendedMood: string; // Standardized to camelCase
  emotionTarget?: string; // Added for components expecting this
  popularity?: number;
  difficulty?: string;
  intensity?: number;
  imageUrl?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  duration: number;
  heartRateBefore: number; // Standardized to camelCase
  heartRateAfter: number; // Standardized to camelCase
  emotionBefore?: string;
  emotionAfter?: string;
  emotionTarget?: string; // Added for components expecting this
  notes?: string;
  rating?: number;
  heart_rate_before?: number; // For backward compatibility
  heart_rate_after?: number; // For backward compatibility
  started_at?: string; // For backward compatibility
  startDate?: string; // For backward compatibility
}

export interface VRHistoryListProps {
  userId?: string;
  limit?: number;
  onSessionClick?: (session: VRSession) => void;
}

export interface VRSessionWithMusicProps {
  session: VRSessionTemplate | VRSession;
  onComplete?: () => void;
  autoplay?: boolean;
}

export interface VRTemplateGridProps {
  filter?: string;
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  featuredOnly?: boolean;
  limit?: number;
}
