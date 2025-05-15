
import { Theme, FontFamily, FontSize } from './theme';
import { NotificationType, NotificationFrequency, NotificationTone } from './notification';

// Combined UserRole type to handle all possible roles
export type UserRole = 
  | 'admin' | 'user' | 'manager' | 'coach' | 'guest' 
  | 'b2b-admin' | 'b2b-user' | 'b2c' | 'b2b_admin' | 'b2b_user'
  | 'moderator' | 'wellbeing_manager' | 'employee' | 'team_lead' 
  | 'professional' | 'b2b-selection' | 'individual';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  avatar?: string;
  created_at: string; // Make created_at required to match types.ts
  createdAt?: string;
  last_sign_in_at?: string;
  onboarded?: boolean;
  preferences?: UserPreferences;
  department?: string;
  position?: string;
  job_title?: string;
  joined_at?: string;
  emotional_score?: number;
  anonymity_code?: string;
  last_active?: string;
  team_id?: string;
  company_id?: string;
  profile?: {
    bio?: string;
    company?: string;
    job_title?: string;
  };
}

export type DashboardLayout = 'standard' | 'compact' | 'focused';

export interface UserPreferences {
  theme: Theme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language?: string;
  ambientSound?: boolean;
  colorAccent?: string;
  dashboardLayout?: DashboardLayout;
  onboardingCompleted?: boolean;
  soundEnabled?: boolean;
  animations?: boolean;
  fullAnonymity?: boolean;
  autoplayVideos?: boolean;
  autoplayMedia?: boolean;
  dataCollection?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  notifications_enabled?: boolean;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  highContrast?: boolean;
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
    screenReader?: boolean;
    reducedMotion?: boolean;
  };
  accessibilityFeatures?: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  notifications?: NotificationPreferences | boolean;
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
    allowCoaching?: boolean;
  } | string;
  incognitoMode?: boolean;
  lockJournals?: boolean;
  dataExport?: boolean;
  avatarUrl?: string;
  profileVisibility?: 'public' | 'team' | 'private';
  displayName?: string;
  pronouns?: string;
  biography?: string;
  timezone?: string;
  musicPreferences?: {
    autoplay: boolean;
    volume: number;
    preferredGenres: string[];
  };
}

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  frequency?: NotificationFrequency;
  types?: Record<string, boolean> | Record<NotificationType, boolean>;
  type?: string;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  tone?: NotificationTone; // Add tone to match mockUsers.ts
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences?: (updates: Partial<UserPreferences>) => void;
  setSinglePreference?: <K extends keyof UserPreferences>(
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

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  loading: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => Promise<User>;
}

export interface InvitationVerificationResult {
  valid: boolean;
  isValid?: boolean;
  expired?: boolean;
  alreadyAccepted?: boolean;
  error?: string;
  email?: string;
  role?: UserRole;
  expires_at?: string;
  message?: string;
  teamId?: string;
  companyId?: string;
  invitation?: {
    id: string;
    email: string;
    role: string;
    expiresAt: string;
  } | {
    email: string;
    role: string;
    expires_at: string;
  };
  data?: {
    id: string;
    email: string;
    role: string;
    expiresAt: string;
  };
}
