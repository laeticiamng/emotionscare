
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
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
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
  privacyLevel?: string;
}

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'montserrat';
export type NotificationFrequency = 'high' | 'medium' | 'low' | 'none';
export type NotificationTone = 'formal' | 'friendly' | 'casual' | 'professional';

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
  timestamp?: string | Date;
  conversation_id?: string;
  role?: string;
  sender_id?: string;
  is_read?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  lastMessage?: string;
  last_message?: string;
  messages?: ChatMessage[];
  // For backwards compatibility
  userId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
  source?: string;
  primaryEmotion?: {
    name: string;
    intensity?: number;
    score?: number;
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
    score?: number;
  };
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
  title?: string;
  created_at?: string | Date;
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
  progress?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress?: number;
  completed?: boolean;
  icon?: string;
  name?: string;
  image_url?: string;
  total?: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
  genre?: string;
  emotion?: string;
  lyrics?: string;
  // For backwards compatibility
  cover_url?: string;
  audio_url?: string;
  url?: string;
  emotion_tag?: string;
  cover?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
  category?: string;
  // For backwards compatibility
  cover_url?: string;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete: () => void;
}

export interface ChatResponse {
  id?: string;
  content?: string;
  message?: string; 
  role?: string;
  timestamp?: string;
  emotion?: string;
}

// Define UserPreferencesState as an alias to UserPreferences
export type UserPreferencesState = UserPreferences;
