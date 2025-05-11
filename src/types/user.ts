export interface User {
  id: string;
  name: string;
  email: string; // Required
  role: string;  // Required
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
  position?: string;
}

export interface UserPreferences {
  theme?: ThemeName;
  notifications?: boolean;
  soundEnabled?: boolean;
  language?: string;
  fontFamily?: FontFamily;
  fontSize?: FontSize;
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
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  font?: string;
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

export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'montserrat' | string;
export type FontSize = 'small' | 'medium' | 'large' | string;
export type NotificationFrequency = 'high' | 'medium' | 'low' | 'none';
export type NotificationTone = 'formal' | 'friendly' | 'casual' | 'professional';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type Theme = ThemeName;

export type UserPreferencesState = UserPreferences;

export interface InvitationVerificationResult {
  valid: boolean;
  message?: string;
  data?: {
    email: string;
    role: string;
    invitationId?: string;
  }
}
