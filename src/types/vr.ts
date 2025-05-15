import { MusicTrack } from './music';

// VR Session Template pour les expériences VR prédéfinies
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string;
  description: string;
  duration: number; // en secondes
  tags: string[];
  thumbnailUrl?: string;
  thumbnail?: string;
  imageUrl?: string;
  coverUrl?: string;
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
  lastUsed?: string | Date;
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
  cover_url?: string;
  video_url?: string;
}

// Enregistrement de session VR utilisateur
export interface VRSession {
  id: string;
  user_id?: string;
  userId?: string;
  template_id: string;
  templateId?: string;
  started_at: string;
  startedAt?: string;
  startTime?: string; // Added for compatibility
  start_time?: string;
  completedAt?: string;
  completed_at?: string;
  endTime?: string; // Added for compatibility
  end_time?: string;
  completed?: boolean;
  isCompleted?: boolean;
  duration: number;
  duration_seconds?: number;
  feedback?: string;
  emotion_before?: string;
  emotionBefore?: string;
  emotion_after?: string;
  emotionAfter?: string;
  emotionTarget?: string; // Added for compatibility
  emotion_target?: string;
  rating?: number;
  notes?: string;
  template?: VRSessionTemplate;
  music_track_id?: string;
  musicTrackId?: string;
  music_track?: MusicTrack;
  musicTrack?: MusicTrack;
  heart_rate_before?: number;
  heartRateBefore?: number;
  heart_rate_after?: number;
  heartRateAfter?: number;
  date?: string;
}

// Props pour le composant VR History List
export interface VRHistoryListProps {
  sessions?: VRSession[];
  templates?: VRSessionTemplate[];
  onSelect?: (session: VRSession) => void;
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  onSelectSession?: (session: VRSession) => void;
  loading?: boolean;
  error?: Error | null;
  className?: string;
  title?: string;
  emptyMessage?: string;
  limit?: number;
}

// Props pour le composant VR Session With Music
export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  onComplete?: (sessionData: any) => void;
  onExit?: () => void;
  onCancel?: () => void;
  session?: VRSession;
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

// Props pour le composant VR Session History
export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  sessions?: VRSession[];
  className?: string;
  onSessionSelect?: (session: VRSession) => void;
}
