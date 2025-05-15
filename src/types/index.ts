
// Theme types
export type Theme = 'light' | 'dark' | 'pastel' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'system' | 'system-ui' | 'serif' | 'sans-serif' | 'sans' | 'monospace' | 'mono' | 'rounded' | 'inter' | 'default';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  getContrastText: (color: string) => 'black' | 'white';
}

// Time of day for adaptive UI
export type TimeOfDayType = 'morning' | 'afternoon' | 'evening' | 'night';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export type UserRole = 'user' | 'admin' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface UserPreferences {
  theme: Theme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: NotificationPreference;
  autoplayVideos: boolean;
  dataCollection: boolean;
  accessibilityFeatures: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  dashboardLayout: 'standard' | 'compact' | 'expanded';
  onboardingCompleted: boolean;
  privacyLevel: 'high' | 'balanced' | 'standard';
  soundEnabled: boolean;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: 'daily' | 'weekly' | 'immediate';
  types: {
    system: boolean;
    emotion: boolean;
    journal: boolean;
    coach: boolean;
  };
}
