
// Define a Theme type for theme preferences
export type Theme = 'light' | 'dark' | 'system';

// Define the structure for user preferences
export interface UserPreferences {
  theme: Theme;
  fontSize?: 'small' | 'medium' | 'large';
  language?: 'fr' | 'en';
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

// Définition des préférences de notifications
export interface NotificationsPreferences {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  types?: {
    system: boolean;
    reminders: boolean;
    updates: boolean;
    marketing: boolean;
  };
}

// Définition des préférences de confidentialité
export type PrivacyPreferences = 'private' | 'friends' | 'public' | {
  shareData: boolean;
  analytics: boolean;
  dataRetention?: string;
};

// Interface de contexte des préférences utilisateur
export interface UserPreferencesContextType {
  preferences: UserPreferences;
  theme: Theme;
  fontSize: string;
  language: string;
  notifications: NotificationsPreferences;
  privacy: PrivacyPreferences | string;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  isLoading: boolean;
  error: Error | null;
}

// Définition des valeurs par défaut pour les préférences utilisateur
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  language: 'fr',
  notifications: {
    email: true,
    push: false,
    inApp: true
  },
  privacy: {
    shareData: false,
    analytics: true
  },
  accessibility: {
    fontSize: 'medium',
    contrast: 'normal',
    reducedMotion: false
  }
};
