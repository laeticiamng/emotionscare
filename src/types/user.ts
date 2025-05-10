
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  avatar_url?: string;  // Added property
  image?: string;       // Added property
  created_at?: Date | string;
  joined_at?: Date | string;  // Added property
  emotional_score?: number;
  anonymity_code?: string;
  onboarded?: boolean;   // Added property
  position?: string;     // Added property
  department?: string;   // Added property
  team_id?: string;      // Added property
  preferences?: UserPreferences; // Added property
}

// UserRole as an enum so it can be used as a value
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  COACH = 'coach',
  THERAPIST = 'therapist',
  HR = 'hr',
  EMPLOYEE = 'employee',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager',
  MANAGER = 'manager'  // Added missing role
}

export interface UserPreferences {
  theme: ThemeName;
  font_size: FontSize;
  notifications_enabled: boolean;
  language: string;
  notifications?: {  // Changed to object with nested properties
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  accent_color?: string;
  reminder_time?: string;
}

export interface UserPreferencesState {
  theme: ThemeName;
  fontSize: FontSize;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  notificationFrequency: NotificationFrequency;
  notificationType: NotificationType;
  notificationTone: NotificationTone;
  accentColor?: string;
  highContrast?: boolean;
  dynamicTheme?: boolean;
  emotionalCamouflage?: boolean;
  push_notifications?: boolean;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  notification_frequency?: string;
  notification_type?: string;
  notification_tone?: string;
}

export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty' | 'system' | 'deep-night';
export type FontSize = 'small' | 'medium' | 'large';

import { NotificationFrequency, NotificationType, NotificationTone } from './notification';
