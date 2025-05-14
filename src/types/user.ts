
// Create or update the file with the corrected type
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  created_at?: string;
  preferences?: UserPreferences;
  bio?: string;
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
  };
}

export interface UserPreferencesState extends UserPreferences {
  setTheme: (theme: ThemeName) => void;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  setNotifications: (prefs: any) => void;
}

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace';

export interface InvitationVerificationResult {
  valid: boolean;
  message?: string;
  data?: {
    email: string;
    role: string;
  };
}

export type UserRole = 'user' | 'admin' | 'therapist' | 'coach' | 'team_manager' | 'client';
