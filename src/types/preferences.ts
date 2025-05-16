
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'system' | 'serif' | 'mono' | 'sans-serif' | 'monospace';

export interface UserPreferences {
  theme?: ThemeName;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  language?: string;
  notifications?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  autoplayVideos?: boolean;
  autoplayMedia?: boolean;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  dataCollection?: boolean;
  accessibilityFeatures?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    screenReader?: boolean;
  };
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  privacyLevel?: string;
  soundEnabled?: boolean;
}
