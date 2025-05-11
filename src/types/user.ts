
export interface User {
  id: string;
  name?: string; // Made optional to allow compatibility with both types
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
  } | boolean; // Allow boolean for backward compatibility
  soundEnabled?: boolean;
  language?: string;
  fontFamily?: string;
  fontSize?: string;
  privacyLevel?: string;
  privacy?: 'public' | 'private' | 'friends';
  showEmotionPrompts?: boolean;
  notification_frequency?: string;
  notification_tone?: string;
  notification_type?: string; // Added to support usePreferences.ts
  emotionalCamouflage?: boolean;
  notifications_enabled?: boolean;
  email_notifications?: boolean; // Added for NotificationPreferences.tsx
  push_notifications?: boolean; // Added for NotificationPreferences.tsx
  aiSuggestions?: boolean; // Added for PremiumFeatures.tsx
  fullAnonymity?: boolean; // Added for PremiumFeatures.tsx
  autoplayVideos?: boolean; // Added for usePreferences.ts
  dataCollection?: boolean;
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
