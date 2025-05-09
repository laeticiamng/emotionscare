
// User roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
  EMPLOYEE = 'employee',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager'
}

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  created_at?: string; // Pour la compatibilité
  avatar?: string;
  avatar_url?: string; // Pour la compatibilité
  image?: string;      // Pour la compatibilité
  anonymity_code?: string;
  emotional_score?: number;
  onboarded?: boolean;
  joined_at?: string;
  preferences?: UserPreferences;
}

// User preferences
export interface UserPreferences {
  theme: ThemeName | 'system';
  language?: string;
  privacy_level?: string;
  share_data_with_coach?: boolean;
  daily_reminder?: boolean;
  reminder_time?: string;
  font_size?: 'small' | 'medium' | 'large';
  color_accent?: string;
  notifications_enabled?: boolean;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// Music types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  audioUrl?: string;
  externalUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  emotion?: string;
}

// Emotion detection types
export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion: string;
  confidence: number;
  score?: number;
  transcript?: string;
  text?: string;
  emojis?: string[];
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
}

// Enhanced emotion result
export interface EnhancedEmotionResult extends EmotionResult {
  suggestions?: string[];
  feedback?: string;
}

// Emotion type for scans
export interface Emotion {
  id: string;
  user_id: string;
  emotion: string;
  confidence: number;
  date: string;
  text?: string;
  score?: number;
  feedback?: string;
  ai_feedback?: string;
  emojis?: string[];
}

// Theme types
export type ThemeName = 'light' | 'dark' | 'pastel';

// Mood data for charts
export interface MoodData {
  date: string;
  value: number;
  emotion?: string;
  originalDate?: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

// Journal entry
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  mood_score: number;
  created_at: string;
  updated_at?: string;
  tags?: string[];
  date?: string;
  text?: string;
  ai_feedback?: string;
}

// VR Session Template
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  image?: string;
  videoUrl?: string;
  benefits: string[];
  emotions: string[];
  popularity: number;
  template_id?: string;
  theme?: string;
  preview_url?: string;
  is_audio_only?: boolean;
  audio_url?: string;
  completion_rate?: number;
  recommended_mood?: string;
}

// VR Session
export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  heart_rate_before: number;
  heart_rate_after: number;
  is_completed: boolean;
  date?: string;
  is_audio_only?: boolean;
}

// Invitation types
export interface InvitationFormData {
  email: string;
  name: string;
  role: UserRole;
  message?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  expired: number;
  sent?: number;
  teams?: any;
  recent_invites?: any[];
}

// Badge type
export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  criteria: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  dateEarned?: string;
  threshold?: number;
  icon_url?: string;
  image_url?: string;
  user_id?: string;
  category?: string;
}

// Type pour la carte VR dans le dashboard
export interface VRCardProps {
  id: string;
  template_id: string;
  theme: string;
  title: string;
  duration: number;
  preview_url: string;
  description: string;
  is_audio_only: boolean;
}

// Challenge type
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress?: number;
  maxProgress?: number;
  deadline?: string;
  category?: string;
}

// Report type
export interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  status: string;
  summary: string;
  downloadUrl?: string;
  generatedBy?: string;
  fileSize?: string;
  lastViewed?: string;
}
