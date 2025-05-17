
import { NotificationPreference } from './notification';

export interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  avatarUrl?: string;
  avatar_url?: string;
  role: UserRole;
  preferences?: UserPreferences;
  teams?: string[];
  department?: string;
  position?: string;
  location?: string;
  status?: 'active' | 'inactive' | 'pending' | 'blocked';
  emotional_score?: number;
  emotionalScore?: number;
  joined_at?: string;
  created_at?: string;
}

export type UserRole = 'admin' | 'user' | 'manager' | 'viewer' | 'coach' | 'b2c' | 'b2b_admin' | 'b2b_user';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system' | 'pastel';
  fontSize: FontSize;
  fontFamily: FontFamily;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  soundEnabled: boolean;
  language?: string;
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  notifications: NotificationPreference;
  privacy: {
    shareData: boolean;
    anonymizeReports: boolean;
    profileVisibility: 'public' | 'team' | 'private';
  };
}

export type FontFamily = 'system' | 'serif' | 'mono' | 'sans' | 'inter';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}
