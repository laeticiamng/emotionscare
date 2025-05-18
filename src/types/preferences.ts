
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
};
