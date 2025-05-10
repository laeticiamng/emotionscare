
export enum NotificationType {
  ALL = 'all',
  IMPORTANT = 'important',
  NONE = 'none'
}

export enum NotificationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  FLEXIBLE = 'flexible',
  NONE = 'none'
}

export enum NotificationTone {
  SILENT = 'silent',
  MOTIVATING = 'motivating',
  GENTLE = 'gentle',
  MINIMALIST = 'minimalist',
  POETIC = 'poetic',
  DIRECTIVE = 'directive'
}

export interface UserPreferences {
  id?: string;
  userId?: string;
  theme?: string;
  fontSize?: string;
  fontFamily?: string;
  language?: string;
  notificationType?: NotificationType;
  notificationsEnabled?: boolean;
  notificationFrequency?: NotificationFrequency;
  notificationTone?: NotificationTone;
  reminderTime?: string;
  darkMode?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  fontScaling?: number;
  colorBlindMode?: string;
  screenReader?: boolean;
  dataSaving?: boolean;
  shareEmotionData?: boolean;
  shareAnonymousData?: boolean;
  locationTracking?: boolean;
  emotionalCamouflage?: boolean;
  voiceControl?: boolean;
  gestures?: boolean;
}

export interface UserPreferencesState extends UserPreferences {
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}
