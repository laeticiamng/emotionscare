
export type FontFamily = 'system-ui' | 'sans-serif' | 'serif' | 'monospace' | 'sans' | 'serif' | 'mono';
export type FontSize = 'small' | 'medium' | 'large' | 'xl';
export type ThemeName = 'light' | 'dark' | 'system';

export interface UserPreferences {
  dashboardLayout: 'standard' | 'compact' | 'focused';
  onboardingCompleted: boolean;
  theme: ThemeName;
  fontSize: FontSize;
  language: string;
  fontFamily: FontFamily;
  sound?: boolean;
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
    types?: Record<string, boolean>;
    tone?: string;
    quietHours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
  } | boolean;
  notifications_enabled?: boolean;
  dataCollection?: boolean;
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
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  autoplayVideos?: boolean;
  soundEnabled?: boolean;
  fullAnonymity?: boolean;
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
  setPreference?: (key: keyof UserPreferences, value: any) => void;
  savePreferences?: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export type UserRole = 'user' | 'admin' | 'manager' | 'coach' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferences: UserPreferences;
  avatar_url?: string;
  avatar?: string;  // Adding for compatibility
  created_at?: string;
  createdAt?: string;
  last_seen?: string;
  profile?: {
    bio?: string;
    company?: string;
    job_title?: string;
  };
  company_id?: string;
  team_id?: string;
  emotional_score?: number;
  anonymity_code?: string;
  last_active?: string;
  department?: string;
  position?: string;
  joined_at?: string;
  onboarded?: boolean;
  job_title?: string;
}
