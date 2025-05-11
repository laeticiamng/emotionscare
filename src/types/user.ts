
export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  image?: string;
  preferences?: UserPreferences;
  // Add missing properties
  createdAt?: string;
  created_at?: string;
  onboarded?: boolean;
  department?: string;
  team_id?: string;
  emotional_score?: number;
  anonymity_code?: string;
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
  privacyLevel?: string;
  privacy?: 'public' | 'private' | 'friends';
  showEmotionPrompts?: boolean;
  notification_frequency?: string;
  notification_tone?: string;
  emotionalCamouflage?: boolean;
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
export type NotificationFrequency = 'high' | 'medium' | 'low' | 'none';
export type NotificationTone = 'formal' | 'friendly' | 'casual' | 'professional';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export type UserPreferencesState = UserPreferences;
