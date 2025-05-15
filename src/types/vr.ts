
import { MusicTrack } from './music';

/**
 * VR session template
 */
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl: string;
  name: string;
  tags: string[];
  benefits: string[];
  theme: string;
  is_audio_only: boolean;
  emotionTarget?: string;
  emotion_target?: string;
  category?: string;
  difficulty?: string;
  preview_url?: string;
  audio_url?: string;
  video_url?: string;
  templateId?: string;
  template_id?: string;
  completionRate?: number;
  recommendedMood?: string;
  recommended_mood?: string;
  lastUsed?: string;
}

/**
 * VR session
 */
export interface VRSession {
  id: string;
  template_id: string;
  templateId?: string;
  user_id: string;
  title: string;
  description?: string;
  startTime?: string;
  start_time?: string;
  startedAt?: string;
  date?: string;
  duration: number;
  duration_seconds?: number;
  completed?: boolean;
  isCompleted?: boolean;
  heartRateBefore?: number;
  heart_rate_before?: number;
  heartRateAfter?: number;
  heart_rate_after?: number;
  template?: VRSessionTemplate;
  emotion_before?: string;
  emotionBefore?: string;
  emotion_after?: string;
  emotionAfter?: string;
}

/**
 * Props for VR history list component
 */
export interface VRHistoryListProps {
  sessions: VRSession[];
  onSessionClick?: (session: VRSession) => void;
  limit?: number;
  showEmptyState?: boolean;
  className?: string;
  isLoading?: boolean;
}

/**
 * Props for VR template grid component
 */
export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onTemplateClick?: (template: VRSessionTemplate) => void;
  filterByEmotion?: string;
  showRecommended?: boolean;
  className?: string;
  isLoading?: boolean;
}

/**
 * Props for VR session with music component
 */
export interface VRSessionWithMusicProps {
  session: VRSession;
  playlist?: MusicTrack[];
  onComplete?: () => void;
  onExit?: () => void;
  autoStart?: boolean;
  className?: string;
}

/**
 * Alias for VRSessionWithMusicProps (for compatibility)
 */
export type VRSessionWithMusicPropsType = VRSessionWithMusicProps;

/**
 * Props for VR session history component
 */
export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  onSessionClick?: (session: VRSession) => void;
  className?: string;
  showHeader?: boolean;
  title?: string;
}
