
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  streak?: number;
  dailyGoal?: number;
  weeklyGoal?: number;
  preferences?: {
    fontSize?: 'small' | 'medium' | 'large';
    backgroundColor?: 'default' | 'blue' | 'mint' | 'coral';
    theme?: 'light' | 'dark';
  };
  anonymity_code?: string;
  emotional_score?: number;
  onboarded?: boolean;
  alias?: string;
}

// UserRole enum for role-based access
export enum UserRole {
  MEDECIN = 'Médecin',
  INFIRMIER = 'Infirmier',
  AIDE_SOIGNANT = 'Aide-soignant',
  INTERNE = 'Interne',
  EMPLOYEE = 'Employé',
  MANAGER = 'Manager',
  ADMIN = 'Admin',
  AUTRE = 'Autre'
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
  is_audio_only?: boolean;
  audio_url?: string;
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  date: string;
  duration: number;
  completed: boolean;
  mood_before?: number;
  mood_after?: number;
}

// Community types - importing from community.ts to centralize types
export * from './community';
