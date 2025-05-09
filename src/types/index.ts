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

export interface UserPreferences {
  theme: 'light' | 'dark' | 'pastel';
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
}

// Theme related types
export type ThemeName = 'light' | 'dark' | 'pastel' | 'system';

// Emotion related types
export interface Emotion {
  id: string;
  user_id: string;
  emotion: string;
  confidence: number;
  date: string;
  score: number;
  text?: string;
  emojis?: string[];
  ai_feedback?: string;
  intensity?: number;
  source?: string;
  transcript?: string;
}

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
  source?: string;
}

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
  user_id?: string; // Add the missing property
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
  category?: string; // Added missing property
  image?: string; // Added missing property
  unlocked?: boolean; // Added missing property
  progress?: number; // Added missing property
  maxProgress?: number; // Added missing property
  criteria?: string; // Added missing property
}

// Challenge related types
export interface Challenge {
  id: string;
  name: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  deadline?: string;
  total?: number;
  title?: string; // Added missing property
  points?: number; // Added missing property
  maxProgress?: number; // Added missing property
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

// Journal related types
export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  date: string;
  title: string;
  mood: string;
  created_at: string;
  ai_feedback?: string;
  text?: string;
  mood_score: number;
}

// Chart types
export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Music related types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  externalUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  emotion?: string;
}

// Invitation types
export interface InvitationStats {
  total: number;
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected?: number;
  teams?: Record<string, number>;
  recent_invites?: any[];
}

export interface InvitationFormData {
  email: string;
  role: string;
  name?: string;
  team_id?: string;
  message?: string;
}

// Navigation types
export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

// Adding MusicPlaylist export for backward compatibility
export { MusicPlaylist, MusicTrack, MusicEmotion } from '@/types/music';

// Add the missing InvitationVerificationResult interface
export interface InvitationVerificationResult {
  valid: boolean;
  message: string;
  invitation?: any;
}
