
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  avatar_url?: string;
  image?: string;
  preferences?: UserPreferences;
  onboarded?: boolean;
  joined_at?: string;
  created_at?: string;
  anonymity_code?: string;
  emotional_score?: number;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: string;
  privacy?: 'public' | 'private' | 'friends';
  fontSize?: FontSize;
  email_notifications?: boolean;
  push_notifications?: boolean;
  notifications_enabled?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
}

export type ThemeName = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

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
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  completed: boolean;
  template?: VRSessionTemplate;
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
  primaryEmotion?: {
    name: string;
    intensity?: number;
  };
}

export interface EmotionPrediction {
  predictedEmotion: string;
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
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string | Date;
  content: string;
  emotion?: string;
  mood_score?: number;
  tags?: string[];
  ai_feedback?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
}

export interface InvitationFormData {
  email: string;
  role: UserRole;
  message?: string;
  expires_in_days: number;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'therapist' | 'coach' | 'guest';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  url?: string;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
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
}

export interface TrackInfoProps {
  track: MusicTrack;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

export interface Track extends MusicTrack {
  coverImage?: string;
}

export interface Playlist extends MusicPlaylist {
  title?: string;
}
