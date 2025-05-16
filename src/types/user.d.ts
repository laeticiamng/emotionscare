
import { NotificationPreferences } from './types';

export type UserRole = 'user' | 'admin' | 'b2b_user' | 'b2b_admin' | 'b2b-user' | 'b2b-admin' | 'collaborator' | 'b2c';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  avatar?: string;
  company_id?: string;
  department?: string;
  position?: string;
  settings?: Record<string, any>;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: "system" | "light" | "dark" | "pastel";
  fontSize: string;
  fontFamily: string;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  soundEnabled: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  shareData?: boolean;
  allowAnalytics?: boolean;
  showProfile?: boolean;
  shareActivity?: boolean;
  allowMessages?: boolean;
  allowNotifications?: boolean;
  language?: string;
  notifications_enabled?: boolean;
  notifications: NotificationPreferences;
  privacy: {
    shareData: boolean;
    anonymizeReports?: boolean;
    profileVisibility: string;
    showProfile?: boolean;
    shareActivity?: boolean;
    allowMessages?: boolean;
    allowNotifications?: boolean;
  };
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
}
