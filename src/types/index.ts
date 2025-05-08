
// Export all types from this central file for consistency

// Music types
export * from './music';

// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  avatar?: string;
  image?: string;
  role: string;
  created_at: string;
  joined_at?: string;
  last_active?: string;
  anonymity_code?: string;
  emotional_score?: number;
  onboarded?: boolean;
  preferences?: UserPreferences;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

export interface UserPreferences {
  theme: "light" | "dark" | "system" | "pastel";
  fontSize: "small" | "medium" | "large";
  backgroundColor: string;
  accentColor: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface Emotion {
  id?: string;
  user_id?: string;
  date?: string | Date;
  score?: number;
  emotion?: string;
  intensity?: number;
  emojis?: string;
  text?: string;
  audio_url?: string;
  ai_feedback?: string;
  confidence?: number;
  source?: string;
  is_confidential?: boolean; // Added missing property
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  confidence?: number;
  intensity?: number;
  score?: number;
  emojis?: string;
  text?: string;
  transcript?: string;
  feedback?: string;
  recommendations?: string[];
  ai_feedback?: string;
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
  recommended_mood?: string;
  is_audio_only?: boolean;
  audio_url?: string;
  completion_rate?: number;
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string | Date;
  end_time?: string | Date;
  duration?: number;
  completed: boolean;
  feedback?: string;
  emotional_state_before?: string;
  emotional_state_after?: string;
  date?: string | Date;
  is_audio_only?: boolean;
  duration_seconds?: number;
  heart_rate_before?: number;
  heart_rate_after?: number;
}

// Badge and gamification types
export interface Badge {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url?: string;
  icon_url?: string;
  category?: string;
  unlocked?: boolean;
  awarded_at: string;
  threshold?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress?: number;
  total?: number; // Added missing property
  deadline?: string;
  category?: string;
}

// Journal types
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string | Date;
  content: string;
  text?: string;
  mood?: string;
  mood_score?: number;
  tags?: string[];
  ai_feedback?: string;
}

// Report types
export interface Report {
  id: string;
  date: string;
  title: string;
  data: any;
  type: string;
  user_id: string;
  summary: string;
  mood_score: number;
  categories: string[];
  recommendations: string[];
  metric: string;
  period_start: string;
  period_end: string;
  value: number;
  change_pct: number;
}

// Chart data types
export interface MoodData {
  date: string;
  value: number;
  originalDate?: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

// Add missing InvitationStats export
export * from './invitation';

// Add any missing types here
