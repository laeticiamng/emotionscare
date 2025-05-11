
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'default' | 'serif' | 'mono' | 'inter';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type Theme = ThemeName; // Make them the same type to avoid assignment errors

export interface UserPreferencesState {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  notifications: boolean;
  notificationSound: boolean;
  language: string;
  privacy: 'public' | 'private' | 'friends';
  privacyLevel?: 'public' | 'private' | 'friends'; // Added for compatibility
  showEmotionPrompts: boolean;
  notification_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  notification_type: 'email' | 'push' | 'both' | 'none';
  notification_tone: 'formal' | 'friendly' | 'energetic';
  emotionalCamouflage: boolean;
  font?: string; // Added for compatibility
}

// Export notification types for compatibility
export type NotificationFrequency = 'daily' | 'weekly' | 'monthly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'energetic';

export const defaultUserPreferences: UserPreferencesState = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'default',
  notifications: true,
  notificationSound: true,
  language: 'fr',
  privacy: 'private',
  showEmotionPrompts: true,
  notification_frequency: 'daily',
  notification_type: 'push',
  notification_tone: 'friendly',
  emotionalCamouflage: false
};
