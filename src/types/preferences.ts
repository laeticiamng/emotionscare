
// Define a Theme type for theme preferences
export type Theme = 'light' | 'dark' | 'system';

// Define the structure for user preferences
export interface UserPreferences {
  theme: Theme;
  notifications?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacy?: {
    shareData: boolean;
    analytics: boolean;
  };
  accessibility?: {
    fontSize: 'small' | 'medium' | 'large';
    contrast: 'normal' | 'high';
    reducedMotion: boolean;
  };
}
