
import { NotificationFrequency, NotificationTone } from './notification';

export type UserRole = 'user' | 'admin' | 'manager' | 'coach' | 'guest';

export interface User {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  emotional_score?: number;
  department?: string;
  position?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'sans-serif' | 'serif' | 'monospace' | 'system';
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  notifications: boolean | NotificationPreferences;
  privacy?: {
    shareData: boolean;
    anonymizeReports: boolean;
    profileVisibility: string | { [key: string]: any };
  };
  language?: string;
  soundEnabled?: boolean;
  sound?: boolean | {
    volume?: number;
    effects?: boolean;
    music?: boolean;
  };
}

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  frequency: NotificationFrequency | string;
  types?: {
    system: boolean;
    emotion: boolean;
    journal: boolean;
    coach: boolean;
    community: boolean;
    achievement: boolean;
  };
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}
