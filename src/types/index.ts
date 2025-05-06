export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  image?: string;
  streak?: number;
  dailyGoal?: number;
  weeklyGoal?: number;
  preferences?: {
    fontSize?: 'small' | 'medium' | 'large';
    backgroundColor?: 'default' | 'blue' | 'mint' | 'coral';
    theme?: 'light' | 'dark' | 'pastel' | 'system';
  };
  anonymity_code?: string;
  emotional_score?: number;
  onboarded?: boolean;
  alias?: string;
  bio?: string;
  joined_at?: string;
  location_url?: string;
}

// UserRole enum pour l'accès générique
export enum UserRole {
  USER = 'Utilisateur',
  MANAGER = 'Manager',
  ADMIN = 'Admin'
}

// Journal related types
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  title?: string;
  content?: string;
  text?: string;
  mood?: number;
  tags?: string[];
  ai_feedback?: string;
  created_at?: string;
}

export interface MoodData {
  date: string;
  originalDate: Date;
  sentiment: number;
  anxiety: number;
  energy: number;
}

// Emotion scan related types
export interface Emotion {
  id?: string;
  user_id: string;
  date: string;
  emotion?: string;
  intensity?: number;
  emojis?: string;
  text?: string;
  audio_url?: string;
  ai_feedback?: string;
  score?: number;
  created_at?: string;
  source?: string;  // Add source property
  is_confidential?: boolean;  // Add is_confidential property
  confidence?: number;  // Add confidence property to make it compatible with EmotionResult
}

// EmotionResult type
export interface EmotionResult {
  emotion: string;
  confidence: number;
  transcript?: string;
  feedback?: string;
  id?: string;
  user_id?: string;
  date?: string;
  intensity?: number;
  score?: number;
}

// Badge related types
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon_url?: string;
  threshold?: number;
  category?: string;
  unlocked?: boolean;
  awarded_at?: string;
}

// Report related types
export interface Report {
  id: string;
  user_id: string;
  date: string;
  title: string;
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

// VR related types
export interface VRSessionTemplate {
  template_id: string;
  theme: string;
  duration: number;
  preview_url: string;
  completion_rate?: number;
  is_audio_only?: boolean;
  audio_url?: string;
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  date: string;
  duration: number;
  duration_seconds: number;
  completed: boolean;
  location_url: string;
  heart_rate_before?: number | null;
  heart_rate_after?: number | null;
  is_audio_only: boolean;
}

// Community types - importing from community.ts to centralize types
export * from './community';
