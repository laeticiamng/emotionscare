
import { MusicTrack } from './music';

// VR Session Template for pre-defined VR experiences
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  tags: string[];
  thumbnailUrl?: string;
  preview_url?: string;
  audioUrl?: string;
  audio_url?: string;
  is_audio_only?: boolean;
  isAudioOnly?: boolean;
  category?: string;
  difficulty?: string;
  benefits?: string[];
  emotion?: string;
  emotion_target?: string;
  emotionTarget?: string;
  theme?: string;
  completionRate?: number;
  completion_rate?: number;
  recommendedMood?: string;
  userRating?: number;
  creator_id?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  is_public?: boolean;
}

// User VR Session record
export interface VRSession {
  id: string;
  user_id?: string;
  userId?: string;
  template_id: string;
  templateId?: string;
  started_at: string;
  startedAt?: string;
  completed_at?: string;
  completedAt?: string;
  duration: number;
  feedback?: string;
  emotion_before?: string;
  emotionBefore?: string;
  emotion_after?: string;
  emotionAfter?: string;
  rating?: number;
  notes?: string;
  template?: VRSessionTemplate;
  music_track_id?: string;
  musicTrackId?: string;
  music_track?: MusicTrack;
  musicTrack?: MusicTrack;
}

// Props for VR History List Component
export interface VRHistoryListProps {
  sessions: VRSession[];
  onSelect?: (session: VRSession) => void;
  loading?: boolean;
  error?: Error | null;
  className?: string;
}

// Props for VR Session With Music Component
export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete?: (sessionData: any) => void;
  onCancel?: () => void;
  autoStart?: boolean;
  className?: string;
  userId?: string;
  suggestedTrack?: MusicTrack;
}

// Different name to avoid conflict
export type VRSessionWithMusicPropsType = VRSessionWithMusicProps;

// Props for VR Template Grid Component
export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  loading?: boolean;
  error?: Error | null;
  filter?: string;
  className?: string;
}

// Props for VR Session History Component
export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showFilters?: boolean;
  className?: string;
  onSessionSelect?: (session: VRSession) => void;
}
