
import { Theme, FontFamily, FontSize } from './theme';
import { NotificationPreference } from './notification';

export interface UserPreferences {
  theme: Theme;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  soundEnabled?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  language?: string;
  dashboardLayout?: Record<string, any> | string;
  onboardingCompleted?: boolean;
  privacy?: {
    shareData: boolean;
    anonymizeReports: boolean;
    profileVisibility: "public" | "team" | "private";
  };
  notifications?: NotificationPreference;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isLoading?: boolean;
}
