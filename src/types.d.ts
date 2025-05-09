
export type ThemeName = 'light' | 'dark' | 'pastel';

export interface UserPreferences {
  theme: ThemeName;
  notifications_enabled: boolean;
  font_size: 'small' | 'medium' | 'large';
  language?: string;
  accent_color?: string;
  background_color?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  reminder_time?: string;
}
