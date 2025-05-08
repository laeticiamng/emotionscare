
// User types
export enum UserRole {
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin',
  EMPLOYEE = 'employe_classique',
  ANALYST = 'analyste',
  WELLBEING_MANAGER = 'responsable_bien_etre'
}

export interface User {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  avatar?: string;  // Added for backward compatibility
  image?: string;   // Added for backward compatibility
  emotional_score?: number;
  team_id?: string;
  team_name?: string;
  anonymity_code?: string;
  onboarded?: boolean;
  joined_at?: string;
  created_at?: string;
  last_active?: string;
  preferences?: UserPreferences;
}

// User preferences
export interface UserPreferences {
  notifications_enabled?: boolean;
  theme?: string;
  language?: string;
  privacy_level?: 'public' | 'team_only' | 'private';
  share_data_with_coach?: boolean;
  daily_reminder?: boolean;
  reminder_time?: string;
  fontSize?: string;
  backgroundColor?: string;
  accentColor?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// Emotion types
export interface Emotion {
  id: string;
  user_id: string;
  date: string; // ISO format date string
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  confidence?: number;
  source?: string;
  intensity?: number; // Added to match usage
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  confidence?: number;
  transcript?: string;
  feedback?: string;
  text?: string;
  emojis?: string;
  score?: number;
  ai_feedback?: string;
  recommendations?: string[];
  intensity?: number;
  user_id?: string;
  date?: string;
}

// Badge types
export interface Badge {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url?: string;
  icon_url?: string;
  category: string;
  unlocked: boolean;
  awarded_at: string; // ISO format date string
  threshold?: number;
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress: number;
  total: number;
  category: string;
}

// VR types
export interface VRSessionTemplate {
  id?: string;
  template_id: string;
  theme: string;
  title?: string;
  duration: number;
  preview_url: string;
  description?: string;
  audio_url?: string;
  is_audio_only?: boolean;
  recommended_mood?: string;
  completion_rate?: number;
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  date?: string;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  heart_rate_before?: number;
  heart_rate_after?: number;
  is_audio_only?: boolean;
  completed: boolean;
}

// Music types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: number;
  externalUrl?: string;
  mood?: string;
  coverImage?: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string; // Added to match usage
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  mood: string;
  tracks: MusicTrack[];
}

// Journal types
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  title?: string;
  content: string;
  text?: string; // Added for backward compatibility
  mood?: string;
  mood_score?: number;
  tags?: string[];
  is_private: boolean;
  ai_feedback?: string;
}

// Mood data for charts
export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
  labels?: {
    [key: string]: string;
  };
}

// Invitation types
export interface InvitationFormData {
  email: string;
  name?: string;
  role: string;
  team_id?: string;
  message?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  sent: number; // Added to match usage
  recent_invites: {
    email: string;
    status: string;
    created_at: string;
  }[];
}

// Report type for mock data
export interface Report {
  id: string;
  title: string;
  description: string;
  created_at: string;
  type: string;
  data: any;
}

export interface InvitationVerificationResult {
  valid: boolean;
  message?: string;
  email?: string;
  role?: string;
}
