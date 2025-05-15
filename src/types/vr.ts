
import { MusicTrack } from './music';

// VR Session Template for pre-defined VR experiences
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // Add this property to fix the errors
  description: string;
  duration: number; // in seconds
  tags: string[];
  thumbnailUrl?: string;
  imageUrl?: string; // Add this property to fix the errors
  coverUrl?: string; // Add this property to fix the errors
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
  lastUsed?: string | Date; // Add this property to fix the errors
  theme?: string;
  completion_rate?: number;
  completionRate?: number;
  recommendedMood?: string;
  recommended_mood?: string;
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
  startedAt?: string; // Add for compatibility
  start_time?: string; // Add for compatibility
  completed_at?: string;
  completedAt?: string;
  end_time?: string; // Add for compatibility
  endTime?: string; // Add for compatibility
  completed?: boolean; // Add for compatibility
  isCompleted?: boolean; // Add for compatibility
  duration: number;
  duration_seconds?: number; // Add for compatibility
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
  heart_rate_before?: number; // Add for compatibility
  heartRateBefore?: number; // Add for compatibility
  heart_rate_after?: number; // Add for compatibility
  heartRateAfter?: number; // Add for compatibility
  date?: string; // Add for compatibility
}

// Props for VR History List Component
export interface VRHistoryListProps {
  sessions: VRSession[];
  templates?: VRSessionTemplate[];
  onSelect?: (session: VRSession) => void;
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  loading?: boolean;
  error?: Error | null;
  className?: string;
  title?: string;
  emptyMessage?: string;
  limit?: number;
}

// Props for VR Session With Music Component
export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete?: (sessionData: any) => void;
  onCancel?: () => void;
  session?: VRSession; // Add missing properties
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
  musicEnabled?: boolean;
  className?: string;
  autoStart?: boolean;
  userId?: string;
  suggestedTrack?: MusicTrack;
}

// Different name to avoid conflict
export type VRSessionWithMusicPropsType = VRSessionWithMusicProps;

// Props for VR Template Grid Component
export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  onSelectTemplate?: (template: VRSessionTemplate) => void; // Added for backward compatibility
  loading?: boolean;
  error?: Error | null;
  filter?: string;
  className?: string;
}

// Props for VR Session History Component
export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  sessions?: VRSession[];
  className?: string;
  onSessionSelect?: (session: VRSession) => void;
}
