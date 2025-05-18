
export interface UserPreferences {
  theme: 'system' | 'light' | 'dark' | 'pastel';
  language: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsletterEnabled: boolean;
  activityTracking: boolean;
  dataSharing: boolean;
  audioEnabled: boolean;
  musicEnabled: boolean;
  autoScanEnabled: boolean;
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  defaultDashboard: 'overview' | 'analytics' | 'emotions' | 'coaching';
  accessibilityMode: boolean;
  highContrastMode: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  animationsEnabled: boolean;
  // Propriétés nécessaires pour les composants audio et préférences
  ambientSound?: string;
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  autoplayMedia?: boolean;
  colorBlindMode?: boolean;
  fontFamily?: 'system' | 'sans' | 'serif' | 'mono' | 'rounded';
  // Propriétés déjà existantes
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  privacy?: {
    dataSharing: boolean;
    analytics: boolean;
    thirdParty: boolean;
    // Propriétés additionnelles pour compatibilité
    shareData?: boolean;
    anonymizeReports?: boolean;
    profileVisibility?: string;
  };
  notifications?: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    types: {
      system: boolean;
      emotion: boolean;
      coach: boolean;
      journal: boolean;
      community: boolean;
      achievement: boolean;
      badge?: boolean;
    };
    frequency: string;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'fr',
  notificationsEnabled: true,
  emailNotifications: true,
  pushNotifications: true,
  newsletterEnabled: true,
  activityTracking: true,
  dataSharing: false,
  audioEnabled: true,
  musicEnabled: true,
  autoScanEnabled: false,
  timezone: 'Europe/Paris',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  defaultDashboard: 'overview',
  accessibilityMode: false,
  highContrastMode: false,
  fontSize: 'medium',
  animationsEnabled: true,
  soundEnabled: true,
  ambientSound: 'nature',
  reduceMotion: false,
  colorBlindMode: false,
  autoplayMedia: false,
  fontFamily: 'system',
  emotionalCamouflage: false,
  aiSuggestions: false,
  privacy: {
    dataSharing: false,
    analytics: true,
    thirdParty: false,
    shareData: false,
    anonymizeReports: false,
    profileVisibility: 'public'
  },
  notifications: {
    enabled: true,
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    types: {
      system: true,
      emotion: true,
      coach: true,
      journal: true,
      community: true,
      achievement: true,
      badge: true
    },
    frequency: 'daily',
    email: true,
    push: true,
    sms: false
  }
};

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isLoading: boolean;
  error?: Error | null;
}
