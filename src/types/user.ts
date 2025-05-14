
import { NotificationPreference } from './types';

export type UserRole = 'user' | 'admin' | 'coach' | 'therapist';
export type ThemeName = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'system-ui' | 'serif' | 'mono';

export interface UserPreferences {
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  theme?: ThemeName;
  fontSize?: FontSize;
  language?: string;
  fontFamily?: FontFamily;
  sound?: boolean;
  notifications?: NotificationPreference;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  preferences: UserPreferences;
  avatar_url?: string;
  created_at?: string;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  setSinglePreference: (key: string, value: any) => void;
  resetPreferences: () => void;
  loading: boolean;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, name: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  preferences: UserPreferencesState;
  logout: () => Promise<void>;
}

export interface InvitationVerificationResult {
  valid: boolean;
  role?: string;
  email?: string;
  expired?: boolean;
  error?: string;
}
