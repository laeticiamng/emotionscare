
import { Theme, FontFamily, FontSize } from './theme';
import { NotificationType, NotificationFrequency, NotificationTone } from './notification';

// Combined UserRole type to handle all possible roles from different files
export type UserRole = 'admin' | 'user' | 'manager' | 'coach' | 'guest' | 'b2b-admin' | 'b2b-user' | 'b2c' | 
                      'moderator' | 'b2b_admin' | 'b2b_user' | 'wellbeing_manager' | 'employee' | 'team_lead' | 
                      'professional' | 'b2b-selection' | 'individual';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  avatar_url?: string;
  avatar?: string; // Added for compatibility
  created_at?: string;
  createdAt?: string; // For compatibility
  last_sign_in_at?: string;
  onboarded?: boolean;
  preferences?: UserPreferences;
  department?: string; // Added for UserDetailView
  position?: string; // Added for UserDetailView
  joined_at?: string; // Added for UserDetailView
  emotional_score?: number; // Added for UserDetailView
}

export interface UserPreferences {
  theme: Theme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language?: string;
  ambientSound?: boolean;
  colorAccent?: string;
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
    screenReader?: boolean;
    reducedMotion?: boolean;
  };
  accessibilityFeatures?: {
    highContrast?: boolean;
    largeText?: boolean;
    screenReader?: boolean;
    reducedMotion?: boolean;
  };
  notifications?: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: NotificationFrequency;
    types?: {
      system: boolean;
      emotion: boolean;
      coach: boolean;
      journal: boolean;
      community: boolean;
    };
    tone?: NotificationTone;
    quietHours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  notifications_enabled?: boolean;
  privacy?: {
    shareData?: boolean;
    anonymizeReports?: boolean;
    publicProfile?: boolean;
    anonymousMode?: boolean;
    dataSharing?: boolean;
    profileVisibility?: 'public' | 'team' | 'private';
    showEmotionalScore?: boolean;
    shareJournalInsights?: boolean;
    anonymousDataContribution?: boolean;
    shareEmotionalData?: boolean;
  } | string;
  incognitoMode?: boolean;
  lockJournals?: boolean;
  dataExport?: boolean;
  avatarUrl?: string;
  profileVisibility?: 'public' | 'team' | 'private'; // Added for UserDetailView
  displayName?: string; // Added for IdentitySettings
  pronouns?: string; // Added for IdentitySettings
  biography?: string; // Added for IdentitySettings
  dashboardLayout?: string;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  loading: boolean;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  loading: boolean;
}
