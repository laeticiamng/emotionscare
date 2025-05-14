
// 📁 src/types/types.ts – Types 100% finalisés pour EmotionsCare

// ——————————————————————
// USER
// ——————————————————————
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  avatar?: string;
  onboarded?: boolean;
  department?: string;
  position?: string;
  anonymity_code?: string;
  emotional_score?: number;
}

export interface UserData extends User {
  status: 'pending' | 'active';
  createdAt: string;
  location?: any;
  preferences: UserPreferences;
}

// ——————————————————————
// USER PREFERENCES
// ——————————————————————
export interface UserPreferences {
  privacy?: 'public' | 'private' | 'team';
  notifications_enabled?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  aiSuggestions?: boolean;
  emotionalCamouflage?: boolean;
}

// ——————————————————————
// PERIOD / TEAM VIEW
// ——————————————————————
export type Period = 'day' | 'week' | 'month';

export interface EmotionalTeamViewProps {
  userId: string;
  className?: string;
  onRefresh?: () => void;
}

// ——————————————————————
// EMOTION
// ——————————————————————
export interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity?: number;
  transcript?: string;
  date?: string;
  emojis?: string[];
  ai_feedback?: string;
  recommendations?: string[];
  category?: string;
  audio_url?: string;
}

// ——————————————————————
// MUSIC
// ——————————————————————
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  genre?: string;
  duration?: number;
  cover?: string;
  audio_url?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  tracks: MusicTrack[];
}

export interface MusicDrawerProps {
  open: boolean;
  onOpenChange: () => void;
  playlist: MusicPlaylist;
  currentTrack: MusicTrack;
}

export interface TrackInfoProps {
  title: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: boolean;
  className?: string;
  compact?: boolean;
}

export interface VolumeControlProps {
  onVolumeChange: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  showTimestamps?: boolean;
}

// ——————————————————————
// VR
// ——————————————————————
export interface VRSessionTemplate {
  title: string;
  name?: string; // Pour compatibilité
  duration: number;
  audio_url?: string;
  videoUrl?: string;
  emotion_target?: string;
  emotion?: string;
  is_audio_only?: boolean;
  lastUsed?: string;
  completion_rate?: number;
  recommended_mood?: string;
  templateId?: string;
  emotions?: string[];
  benefits?: string[];
  difficulty?: string;
  tags?: string[];
}

export interface VRSession {
  id: string;
  userId?: string;
  templateId?: string;
  date?: string;
  startDate?: string;
  startedAt?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  duration_seconds?: number;
  is_audio_only?: boolean;
  completed?: boolean;
  isCompleted?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
}

export interface VRSessionWithMusicProps {
  session?: VRSessionTemplate;
  template?: VRSessionTemplate;
  onSessionComplete?: () => void;
  onComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
}

// ——————————————————————
// Voice/Scan
// ——————————————————————
export interface VoiceEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
}

// ——————————————————————
// CONTEXT
// ——————————————————————
export interface AuthContextType {
  user: User | null;
  preferences: UserPreferences;
  setSinglePreference: (key: string, value: any) => void;
}

// ——————————————————————
// GÉNÉRAL
// ——————————————————————
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
