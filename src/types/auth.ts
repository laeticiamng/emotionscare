
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar_url?: string;
  onboarded?: boolean;
  job_title?: string;
  department?: string;
  team_id?: string;
  anonymity_code?: string;
  created_at?: string;
  preferences?: UserPreferences;
}

export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin' | 'user' | 'manager' | 'wellbeing_manager' | 'coach' | 'employee' | 'moderator';

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

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'extra-large';
  fontFamily: 'default' | 'serif' | 'mono' | 'sans' | 'inter' | 'system-ui';
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
    types?: {
      system: boolean;
      emotion: boolean;
      coach: boolean;
      journal: boolean;
      community: boolean;
    };
    tone?: string;
    quietHours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  sound?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  highContrast?: boolean;
  reduceAnimations?: boolean;
  soundEffects?: boolean;
  colorAccent?: string;
  language?: string;
  privacyLevel?: string;
  onboardingCompleted?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
  notifications_enabled?: boolean;
  privacy?: {
    anonymousMode?: boolean;
    dataSharing?: boolean;
    profileVisibility?: 'public' | 'team' | 'private';
  };
  dashboardLayout?: string;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  setSinglePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => Promise<void>;
  resetPreferences: () => Promise<void>;
  loading: boolean;
}

export type FontFamily = 'default' | 'serif' | 'mono' | 'sans' | 'inter' | 'system-ui';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'extra-large';
export type ThemeName = 'light' | 'dark' | 'system';
