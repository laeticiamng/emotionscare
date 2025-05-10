
import { ThemeName, FontSize, FontFamily, NotificationFrequency, NotificationType, NotificationTone, DynamicThemeMode } from './index';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: UserPreferences;
  role?: UserRole;
  is_premium?: boolean;
  last_login?: string;
  streak_days?: number;
  emotional_score?: number;
  anonymity_code?: string;
  avatar?: string;
}

export type UserRole = 'user' | 'admin' | 'coach' | 'premium' | 'employee' | 'analyst' | 'wellbeing_manager';

export const UserRole = {
  USER: 'user' as UserRole,
  ADMIN: 'admin' as UserRole,
  COACH: 'coach' as UserRole,
  PREMIUM: 'premium' as UserRole,
  EMPLOYEE: 'employee' as UserRole,
  ANALYST: 'analyst' as UserRole,
  WELLBEING_MANAGER: 'wellbeing_manager' as UserRole
};

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  notificationsEnabled: boolean;
  notificationFrequency: NotificationFrequency;
  notificationType: NotificationType; 
  notificationTone: NotificationTone;
  reminderTime: string;
  dynamicTheme: DynamicThemeMode;
  emotionalCamouflage?: boolean;
  channels: {
    journal: boolean;
    breathing: boolean;
    music: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface InvitationFormData {
  email: string;
  name?: string;
  role: UserRole;
  message?: string;
  expiresAt?: Date;
}
