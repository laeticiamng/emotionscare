
export type FontFamily = 'system-ui' | 'sans-serif' | 'serif' | 'monospace';
export type FontSize = 'small' | 'medium' | 'large';
export type ThemeName = 'light' | 'dark' | 'system';

export interface UserPreferences {
  dashboardLayout: 'standard' | 'compact' | 'focused';
  onboardingCompleted: boolean;
  theme: ThemeName;
  fontSize: FontSize;
  language: string;
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
    types: Record<string, boolean>;
    tone: string;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  fontFamily: FontFamily; // Add missing properties
  sound: boolean;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  setSinglePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
  loading: boolean;
}

export type UserRole = 'user' | 'admin' | 'manager' | 'coach';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferences: UserPreferences;
  avatar_url?: string;
  created_at?: string;
  last_seen?: string;
  profile?: {
    bio?: string;
    company?: string;
    job_title?: string;
  };
}

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  role?: UserRole;
  expires_at?: string;
  message?: string;
}
