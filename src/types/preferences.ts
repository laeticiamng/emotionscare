
export enum NotificationType {
  ALL = 'all',
  IMPORTANT = 'important',
  NONE = 'none',
  // Types supplémentaires pour la compatibilité
  MINIMAL = 'minimal',
  DETAILED = 'detailed',
  FULL = 'full'
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
  
  // Champs pour la compatibilité
  font_size?: string;
  notifications_enabled?: boolean;
  reminder_time?: string;
  
  // Champs de UserPreferences dans user.ts
  notifications?: boolean;
  autoplayVideos?: boolean;
  showEmotionPrompts?: boolean;
  privacyLevel?: string;
  dataCollection?: boolean;
  marketing_emails?: boolean;
  feature_announcements?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  accent_color?: string;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
}

export interface UserPreferencesState extends UserPreferences {
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  preferences?: UserPreferences;
  
  // Propriétés nécessaires dans ImmersiveSettingsPage
  notificationsEnabled?: boolean;
  notificationFrequency?: NotificationFrequency;
  notificationType?: NotificationType;
  notificationTone?: NotificationTone;
  emotionalCamouflage?: boolean;
  reminderTime?: string;
  notifications_enabled?: boolean;
  reminder_time?: string;
}

export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type FontSize = 'small' | 'medium' | 'large';
