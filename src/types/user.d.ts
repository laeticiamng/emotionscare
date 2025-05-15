
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  language?: string;
  accessibility?: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
  privacy?: {
    shareActivity: boolean;
    profileVisibility: 'public' | 'friends' | 'private' | 'team';
    shareData?: boolean;
    anonymizeReports?: boolean;
    publicProfile?: boolean;
    anonymousMode?: boolean;
    dataSharing?: boolean;
    showEmotionalScore?: boolean;
    shareJournalInsights?: boolean;
    anonymousDataContribution?: boolean;
    shareEmotionalData?: boolean;
    allowCoaching?: boolean;
  };
  // Add sound property
  sound?: {
    volume: number;
    muted: boolean;
    enableSoundEffects: boolean;
  };
  soundEnabled?: boolean;
  notifications?: boolean | NotificationPreferences;
  privacyLevel?: string;
  onboardingCompleted?: boolean;
  dashboardLayout?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  email?: boolean;
  push?: boolean;
  inApp?: boolean;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  frequency?: NotificationFrequency;
  types?: Record<string, boolean>;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  tone?: string;
}

export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  preferences?: UserPreferences;
  created_at?: string;
}
