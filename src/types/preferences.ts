
export interface UserPreferences {
  theme: 'system' | 'light' | 'dark';
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
  fontSize: 'small' | 'medium' | 'large';
  animationsEnabled: boolean;
  // Ajout des propriétés manquantes
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  privacy?: {
    dataSharing: boolean;
    analytics: boolean;
    thirdParty: boolean;
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
  emotionalCamouflage: false,
  aiSuggestions: false,
  privacy: {
    dataSharing: false,
    analytics: true,
    thirdParty: false
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
}
