
import { Theme, FontFamily, FontSize } from './theme';

export interface UserPreferences {
  theme: Theme;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  notifications?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  };
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  language?: string;
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  // Ajoutez d'autres préférences utilisateur selon les besoins
}
