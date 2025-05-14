
// Create or update the file with the corrected type
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  avatar?: string;
  role: UserRole;
  created_at?: string;
  createdAt?: string;
  joined_at?: string;
  preferences?: UserPreferences;
  bio?: string;
  onboarded?: boolean;
  department?: string;
  position?: string;
  emotional_score?: number;
  team_id?: string;
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language?: string;
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
  };
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  privacy?: string;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
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

export type UserRole = 'user' | 'admin' | 'therapist' | 'coach' | 'team_manager' | 'client' | 'b2c' | 'b2b_user' | 'b2b_admin' | 'employee' | 'manager' | 'analyst' | 'wellbeing_manager';

