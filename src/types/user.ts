
export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'coach' | 'therapist';
  avatar_url?: string;
  position?: string;
  department?: string;
  joined_at?: string;
  bio?: string;
  onboarded?: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: boolean;
  soundEnabled?: boolean;
}

export interface UserPreferencesState extends UserPreferences {
  isLoading: boolean;
  isEditing: boolean;
  hasChanges: boolean;
  originalValues: UserPreferences;
}

export interface ThemeSettings {
  name: ThemeName;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  animations?: boolean;
}

// Import from ThemeContext
import { Theme, FontSize, FontFamily } from '@/contexts/ThemeContext';
export type ThemeName = Theme;
export type { FontSize, FontFamily };
