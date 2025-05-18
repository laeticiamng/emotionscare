
import { ThemeName, FontFamily, FontSize } from './theme';

export interface UserPreferences {
  theme: ThemeName;
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  reduceMotion?: boolean;
  soundEnabled?: boolean;
  dashboardLayout?: Record<string, any>;
  privacy?: {
    shareActivity?: boolean;
    shareJournal?: boolean;
    publicProfile?: boolean;
    shareData?: boolean;
    anonymizeReports?: boolean;
    profileVisibility?: string;
  };
  onboardingCompleted?: boolean;
  ambientSound?: string;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  notifications?: {
    enabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    types?: Record<string, boolean>;
    frequency?: string;
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    inApp?: boolean;
  };
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}
