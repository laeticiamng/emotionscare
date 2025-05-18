
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
  };
  onboardingCompleted?: boolean;
  ambientSound?: string;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}
