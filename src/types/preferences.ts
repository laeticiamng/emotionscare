
import { ThemeName, FontSize } from './index';
import { NotificationFrequency, NotificationType, NotificationTone } from './notification';

export interface UserPreferencesState {
  theme: ThemeName;
  fontSize: FontSize;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  notificationFrequency: NotificationFrequency;
  notificationType: NotificationType;
  notificationTone: NotificationTone;
  accentColor?: string;
  highContrast?: boolean;
  dynamicTheme?: boolean;
  emotionalCamouflage?: boolean;
}
