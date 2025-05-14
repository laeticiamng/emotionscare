
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: UserPreferences;
  role?: UserRole;
  department?: string;
  team?: string;
  position?: string;
  company?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  social?: Record<string, string>;
  is_active?: boolean;
  is_verified?: boolean;
  last_login?: string;
  last_seen?: string;
  badge_count?: number;
  has_password?: boolean;
  job_title?: string;
}

export interface UserPreferences {
  theme?: string;
  fontSize?: string;
  fontFamily?: string;
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
  };
  dashboardLayout?: string;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  onboardingCompleted?: boolean;
  sound?: {
    enabled: boolean;
    volume: number;
    effects: boolean;
  };
  accessibility?: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    largeText: boolean;
  };
}

export type UserPreferencesState = UserPreferences & {
  updatePreference: (key: keyof UserPreferences, value: any) => void;
  resetPreferences: () => void;
  loading: boolean;
  error: Error | null;
};

export type FontFamily = 'system' | 'serif' | 'mono' | 'sans';
export type FontSize = 'small' | 'medium' | 'large';
export type ThemeName = 'light' | 'dark' | 'system';
export type UserRole = 'user' | 'admin' | 'manager' | 'guest';

export interface InvitationVerificationResult {
  valid: boolean;
  message: string;
  invitation?: {
    id: string;
    email: string;
    role: UserRole;
    expires_at: string;
  };
}
