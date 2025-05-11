export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  avatar_url?: string;
  image?: string;
  position?: string;
  department?: string;
  preferences?: UserPreferences;
  onboarded?: boolean;
  joined_at?: string;
  created_at?: string;
  anonymity_code?: string;
  emotional_score?: number;
}

export interface UserPreferences {
  theme?: ThemeName;
  notifications?: boolean;
  language?: string;
  privacy?: 'public' | 'private' | 'friends';
  fontSize?: FontSize;
  email_notifications?: boolean;
  push_notifications?: boolean;
  notifications_enabled?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  showEmotionPrompts?: boolean;
  notification_frequency?: string;
  notification_type?: string;
  notification_tone?: string;
  emotionalCamouflage?: boolean;
}

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'default' | 'serif' | 'mono';

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  completed: boolean;
  template?: VRSessionTemplate;
  date?: string;
  duration?: number;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
}

export interface VRSessionTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number;
  theme: string;
  is_audio_only: boolean;
  preview_url: string;
  audio_url: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  benefits: string[];
  emotions: string[];
  popularity: number;
  template_id?: string;
  completion_rate?: number;
  emotion_target?: string;
  level?: string;
  recommended_mood?: string;
}

export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_type?: string;
  timestamp?: string;
  conversation_id?: string;
  role?: string;
}

export interface Emotion {
  id: string;
  user_id: string;
  date: any;
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string | null;
  ai_feedback?: string;
  created_at?: string;
  confidence?: number;
  intensity?: number;
  name?: string;
  category?: string;
  primaryEmotion?: {
    name: string;
    intensity?: number;
  };
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion?: string;
  score?: number;
  confidence?: number;
  feedback?: string;
  text?: string;
  emojis?: string;
  ai_feedback?: string;
  intensity?: number;
  transcript?: string;
  recommendations?: string[];
  primaryEmotion?: {
    name: string;
    intensity?: number;
  };
}

export interface EmotionPrediction {
  predictedEmotion: string;
  emotion?: string;
  probability: number;
  confidence?: number;
  triggers?: string[];
  recommendations?: string[];
}

export interface MoodData {
  id?: string;
  date: Date | string;
  originalDate?: Date | string;
  value: number;
  label?: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  type: string;
  seen?: boolean;
  image?: string;
  emotion?: string;
  cta?: {
    label: string;
    route: string;
    text?: string;
    action?: string;
  };
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: number;
  confidence: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
  user_id?: string;
  unlocked_at?: string;
  progress?: number; // Added for compatibility
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string | Date;
  content: string;
  text?: string;
  emotion?: string;
  mood_score?: number;
  tags?: string[];
  ai_feedback?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  expired: number;
  accepted: number;
  rejected: number;
  sent: number;
  completed: number;
  conversionRate: number;
  averageTimeToAccept: number;
  teams: Record<string, number>;
  recent_invites: InvitationData[];
}

export interface InvitationData {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'rejected';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  role: string;
}

export interface InvitationFormData {
  email: string;
  role: UserRole;
  message?: string;
  expires_in_days: number;
  expiresIn?: number;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'therapist' | 'coach' | 'guest' | 'employee';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  url?: string;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  mood?: string;
  audioUrl?: string;
  emotion?: string;
  emotion_tag?: string;
  audio_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description: string;
  tracks: MusicTrack[];
  coverImage?: string;
  category?: string;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (time: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
  className?: string;
}

export interface TrackInfoProps {
  track: MusicTrack;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: boolean;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  onVolumeChange?: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface Track extends MusicTrack {
  coverImage?: string;
  coverUrl?: string;
}

export interface Playlist extends MusicPlaylist {
  title?: string;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete: () => void;
}

export interface ChatResponse {
  id?: string;
  content?: string;
  message?: string; // Added for compatibility
  role?: string;
  timestamp?: string;
  emotion?: string; // Added for compatibility
}
