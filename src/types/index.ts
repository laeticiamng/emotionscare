
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
  theme: ThemeName;
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
}

// Theme types
export type ThemeName = 'light' | 'dark' | 'pastel';

// Mood data for charts
export interface MoodData {
  date: string;
  value: number;
  emotion?: string;
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
}

