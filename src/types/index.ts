
// Common types used across the application

// User related types
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  USER = 'user',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  avatar_url?: string;
  image?: string;
  department?: string;
  position?: string;
  team_id?: string;
  created_at?: string;
  last_login?: string;
  joined_at?: string;
  anonymity_code?: string;
  emotional_score?: number;
  onboarded?: boolean;
  preferences?: UserPreferences;
}

// Theme related types
export type ThemeName = 'light' | 'dark' | 'pastel' | 'system' | 'nature' | 'deep-night';

// Report related types
export interface Report {
  id: string;
  title: string;
  type: string;
  period: string;
  data: any;
  date: string;
  created_at?: string;
  metrics?: any;
  description?: string;
  user_id?: string;
  summary?: string;
  mood_score?: number;
  categories?: string[];
  recommendations?: string[];
  metric?: string;
  period_start?: string;
  period_end?: string;
  value?: number;
  change_pct?: number;
}

// Badge related types
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  user_id: string;
  icon?: string;
  level?: number;
  awarded_at?: string;
  threshold?: number;
  icon_url?: string;
  category?: string;
  image?: string;
  unlocked?: boolean;
  progress?: number;
  maxProgress?: number;
  criteria?: string;
}

// VR related types
export interface VRSessionTemplate {
  id: string;
  template_id: string;
  theme: string;
  title: string;
  duration: number;
  preview_url: string;
  description: string;
  is_audio_only: boolean;
  audio_url?: string;
  recommended_mood?: string;
  category: string;
  benefits: string[];
  emotions: string[];
  popularity: number;
  completion_rate?: number;
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  start_time: string;
  date?: string;
  duration: number;
  duration_seconds?: number;
  completed: boolean;
  feedback?: string;
  mood_before?: string;
  mood_after?: string;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
}

// User preferences
export interface UserPreferences {
  theme: ThemeName;
  notifications_enabled: boolean;
  font_size: 'small' | 'medium' | 'large';
  language: string;
  accent_color?: string;
  background_color?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  reminder_time?: string;
  dynamic_theme?: {
    enable_time_based?: boolean;
    enable_emotion_based?: boolean;
    enable_weather_based?: boolean;
  };
  accessibility?: {
    high_contrast?: boolean;
    reduced_motion?: boolean;
    screen_reader_optimized?: boolean;
    keyboard_navigation?: boolean;
  };
  audio?: {
    volume?: number;
    continue_playback?: boolean;
    ambient_sound?: string;
    context_music?: boolean;
    immersive_mode?: boolean;
  };
  data_preferences?: {
    export_format?: 'json' | 'pdf';
    incognito_mode?: boolean;
    data_retention_period?: number;
  };
}

// Invitation related types
export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  sent: number;
  rejected: number;
  teams?: Record<string, number>;
  recent_invites?: any[];
}

export interface InvitationFormData {
  email: string;
  name?: string;
  role: UserRole;
  team_id?: string;
  expiration_days?: number;
  message?: string;
}

// Journal Entry related types
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  date: string;
  created_at: string;
  updated_at?: string;
  mood?: number;
  tags?: string[];
  is_private?: boolean;
  emotion?: string;
  ai_insights?: string;
  ai_feedback?: string;
  color?: string;
}

// Mood data for charts
export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

// Music track related types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  cover_url?: string;
  genre?: string;
  mood?: string;
  emotions?: string[];
  intensity?: number;
  bpm?: number;
  is_favorite?: boolean;
  play_count?: number;
  created_at?: string;
  is_ai_generated?: boolean;
  track_number?: number;
  year?: number;
}

// Export all types from the separate type files
export * from './emotion';
export * from './navigation';
export * from './chat';
export * from './music';
export * from './scan';
export * from './invitation';
export * from './community';
export * from './gamification';
export * from './audio-player';
export * from './journal';
