
// User and UserPreferences types

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  preferences?: UserPreferences;
  [key: string]: any;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system' | 'pastel';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'system' | 'sans-serif' | 'serif' | 'monospace';
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  soundEnabled: boolean;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
    [key: string]: boolean | undefined;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export interface PrivacyPreferences {
  shareData: boolean;
  anonymizeReports: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
}
