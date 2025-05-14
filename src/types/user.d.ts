
export type UserRole = 'admin' | 'user' | 'therapist' | 'coach' | 'pending' | 'manager';
export type ThemeName = 'light' | 'dark' | 'pastel' | 'system';
export type FontFamily = 'system' | 'serif' | 'mono' | 'comic';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large';

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  role?: UserRole;
  name?: string;
  error?: string;
  invitation_id?: string;
}

export interface UserPreferences {
  theme?: ThemeName;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  highContrast?: boolean;
  reduceAnimations?: boolean;
  language?: string;
  notifications?: boolean | {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency?: string;
    types?: Record<string, boolean>;
    tone?: string;
    quietHours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
    type?: string;
    soundEnabled?: boolean;
  };
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  privacy?: 'public' | 'private' | 'friends';
  experimental?: boolean;
}

export interface UserPreferencesState extends UserPreferences {
  isLoading: boolean;
  setPreference: (key: keyof UserPreferences, value: any) => void;
  savePreferences: () => Promise<void>;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: UserRole;
  isActive?: boolean;
  onboarded?: boolean;
  preferences?: UserPreferences;
  created_at?: string;
  last_sign_in_at?: string;
  company_id?: string;
  company_role?: string;
  job_title?: string;
}
