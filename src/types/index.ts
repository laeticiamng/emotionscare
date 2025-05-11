
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
  privacyLevel?: 'public' | 'private' | 'friends';
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
  font?: string;
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
  emotion_before?: string;
  emotion_after?: string;
  mood_before?: string;
  mood_after?: string;
  emotions?: string[];
}

export interface VRSessionTemplate {
  id: string;
  name: string;
  title?: string;
  description: string;
  duration: number;
  theme?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags: string[];
  benefits?: string[];
  emotions?: string[];
  popularity?: number;
  template_id?: string;
  completion_rate?: number;
  emotion_target?: string;
  level?: string;
  recommended_mood?: string;
  thumbnail: string;
  intensity: 'low' | 'medium' | 'high';
  youtubeId?: string;
  lastUsed?: Date;
  recommendedFor?: string[];
}

// Export other needed types from src/types
export * from './music';
export * from './preferences';
export * from './invitation';
export * from './vr';
