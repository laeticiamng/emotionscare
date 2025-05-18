
/**
 * Types officiels pour les préférences utilisateur.
 * Toute modification doit être synchronisée dans tous les mocks et composants.
 * Ne jamais dupliquer ce type en local.
 */

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  theme: string;
  fontSize: string;
  language: string;
  notifications: NotificationsPreferences;
  privacy: string | PrivacyPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  resetPreferences?: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export interface NotificationsPreferences {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled?: boolean;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
    badge?: boolean;
  };
  frequency?: string;
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  tone?: string;
  // Champs supplémentaires utilisés par les composants
  newsletterEnabled?: boolean;
}

export interface PrivacyPreferences {
  dataSharing: boolean;
  analytics: boolean;
  thirdParty: boolean;
  shareData?: boolean; // For backwards compatibility
  anonymizeReports?: boolean;
  profileVisibility?: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'pastel' | 'system';
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
  language?: string;
  privacy?: string | PrivacyPreferences;
  notifications?: NotificationsPreferences | boolean;
  // Champs supplémentaires utilisés par les composants
  fontFamily?: string;
  reduceMotion?: boolean;
  colorBlindMode?: boolean | string; // Allow both boolean and string
  autoplayMedia?: boolean;
  soundEnabled?: boolean;
  dashboardLayout?: string | object;
  onboardingCompleted?: boolean;
  shareData?: boolean;
  anonymizedData?: boolean;
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  newsletterEnabled?: boolean;
  // Propriétés additionnelles pour résoudre les erreurs
  ambientSound?: string;
  activityTracking?: boolean;
  dataSharing?: boolean;
  audioEnabled?: boolean;
  musicEnabled?: boolean;
  autoScanEnabled?: boolean;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: string;
  defaultDashboard?: string;
  accessibilityMode?: boolean;
  highContrastMode?: boolean;
  animationsEnabled?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
}

// Utilitaire pour normaliser les préférences
export function normalizePreferences(prefs: any): UserPreferences {
  if (!prefs) return {
    theme: 'system',
    fontSize: 'medium',
    language: 'fr',
    privacy: 'private',
    notifications: {
      enabled: true,
      emailEnabled: true,
      pushEnabled: false
    }
  };

  return {
    theme: prefs.theme || 'system',
    fontSize: prefs.fontSize || 'medium',
    language: prefs.language || 'fr',
    privacy: prefs.privacy || 'private',
    notifications: typeof prefs.notifications === 'boolean' ? 
      { enabled: prefs.notifications, emailEnabled: false, pushEnabled: false } : 
      prefs.notifications || { enabled: true, emailEnabled: true, pushEnabled: false }
  };
}

// Re-export des préférences par défaut pour un accès centralisé
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  language: 'fr',
  privacy: 'private',
  notifications: {
    enabled: true,
    emailEnabled: true,
    pushEnabled: false
  },
  soundEnabled: false,
  autoplayMedia: true,
  dashboardLayout: 'default'
};
