
export type ThemeName = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserPreferences {
  theme?: ThemeName;
  language?: string;
  privacy?: 'public' | 'private' | 'friends';
  notifications?: boolean;
  notifications_enabled?: boolean;
  notification_frequency?: string;
  notification_type?: string;
  notification_tone?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  fontSize?: FontSize;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  emotionalCamouflage?: boolean;
  experimentalFeatures?: boolean;
}
