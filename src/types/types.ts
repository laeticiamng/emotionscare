
// User-related types
export type UserRole = 
  | 'admin' | 'user' | 'manager' | 'coach' | 'guest' 
  | 'b2b_admin' | 'b2b_user' | 'b2c' | 'moderator' | 'wellbeing_manager' 
  | 'employee' | 'team_lead' | 'professional' | 'individual';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  onboarded?: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: Theme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: NotificationPreference;
  autoplayVideos: boolean;
  dataCollection: boolean;
  accessibilityFeatures: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  dashboardLayout: 'standard' | 'compact' | 'expanded';
  onboardingCompleted: boolean;
  privacyLevel: 'high' | 'balanced' | 'standard';
  soundEnabled: boolean;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  isLoading: boolean;
  error: string | null;
}

// Theme types
export type Theme = 'light' | 'dark' | 'pastel' | 'system';
export type ThemeName = Theme;
export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'system' | 'system-ui' | 'serif' | 'sans-serif' | 'sans' | 'monospace' | 'mono' | 'rounded' | 'inter' | 'default';

// Time periods
export type Period = 'day' | 'week' | 'month' | 'year' | 'all';

// User mode for app (B2C, B2B)
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

// Invitation verification result
export interface InvitationVerificationResult {
  isValid: boolean;
  message: string;
  role?: UserRole;
  email?: string;
  token?: string;
}

// Notification preferences
export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: 'daily' | 'weekly' | 'immediate';
  types: {
    system: boolean;
    emotion: boolean;
    journal: boolean;
    coach: boolean;
  };
}
