
export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  image?: string; 
  avatar_url?: string;
  preferences?: UserPreferences;
  createdAt?: string;
  created_at?: string;
  onboarded?: boolean;
  department?: string;
  team_id?: string;
  emotional_score?: number;
  anonymity_code?: string;
  goals?: string[];
}

export interface UserPreferences {
  theme?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  soundEnabled?: boolean;
  language?: string;
  fontFamily?: string;
  fontSize?: string;
  privacyLevel?: string;
  privacy?: 'public' | 'private' | 'friends';
  showEmotionPrompts?: boolean;
  notification_frequency?: string;
  notification_tone?: string;
  notification_type?: string;
  emotionalCamouflage?: boolean;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
}

export enum UserRole {
  USER = 'user',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin',
  WELLBEING_MANAGER = 'wellbeing_manager',
  COACH = 'coach', 
  ANALYST = 'analyst'
}

export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'montserrat';
export type FontSize = 'small' | 'medium' | 'large';
export type NotificationFrequency = 'high' | 'medium' | 'low' | 'none';
export type NotificationTone = 'formal' | 'friendly' | 'casual' | 'professional';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type Theme = ThemeName;

export type UserPreferencesState = UserPreferences;
