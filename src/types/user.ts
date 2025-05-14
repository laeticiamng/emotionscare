
// User types for the application
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  avatar?: string;  // Adding this field for compatibility
  role: UserRole;
  createdAt?: string;
  created_at?: string;
  company_id?: string;
  team_id?: string;
  emotional_score?: number;
  anonymity_code?: string;
  last_active?: string;
  department?: string;
  position?: string;
  joined_at?: string;
  preferences?: UserPreferences;
  onboarded?: boolean;
  job_title?: string;
}

export type FontFamily = 'sans' | 'serif' | 'mono';
export type FontSize = 'small' | 'medium' | 'large' | 'xl';
export type ThemeName = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  notifications: boolean | {
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
  notifications_enabled?: boolean;
  sound: boolean;
  language: string;
  dashboardLayout: 'standard' | 'compact' | 'focused';
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  onboardingCompleted?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  privacy?: {
    showEmotionalScore?: boolean;
    shareJournalInsights?: boolean;
    anonymousDataContribution?: boolean;
    profileVisibility?: 'public' | 'private' | 'team';
    shareData?: boolean;
    anonymizeReports?: boolean;
    publicProfile?: boolean;
    shareEmotionalData?: boolean;
    allowCoaching?: boolean;
  };
  timezone?: string;
  musicPreferences?: {
    autoplay: boolean;
    volume: number;
    preferredGenres: string[];
  };
  accessibilityFeatures?: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  reduceMotion?: boolean;
  highContrast?: boolean;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreference: (key: keyof UserPreferences, value: any) => void;
  savePreferences: () => Promise<void>;
  resetPreferences: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface InvitationVerificationResult {
  valid: boolean;
  isValid?: boolean;
  role?: UserRole;
  teamId?: string;
  companyId?: string;
  email?: string;
  error?: string;
}
