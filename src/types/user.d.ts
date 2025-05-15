
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean | NotificationPreferences;
  language: string;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
  privacy: {
    shareActivity: boolean;
    profileVisibility: 'public' | 'friends' | 'private';
  };
  // Add the missing property
  sound?: {
    volume: number;
    muted: boolean;
    enableSoundEffects: boolean;
  };
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: NotificationFrequency;
}

export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  preferences?: UserPreferences;
  created_at?: string;
}
