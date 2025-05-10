
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserPreferences {
  theme?: string;
  font?: FontFamily;
  fontSize?: FontSize;
  highContrast?: boolean;
  reducedAnimations?: boolean;
  keyboardNavigation?: boolean;
  screenReader?: boolean;
  audioGuidance?: boolean;
  notificationFrequency?: 'daily' | 'weekly' | 'flexible' | 'none';
  notificationTone?: 'minimalist' | 'poetic' | 'directive' | 'silent';
  notifications_enabled?: boolean;
  reminder_time?: string;
  incognitoMode?: boolean;
  dataExport?: 'pdf' | 'json';
  emotionalCamouflage?: boolean;
  duoModeEnabled?: boolean;
  trustedContact?: string;
  displayName?: string;
  pronouns?: 'il' | 'elle' | 'iel' | 'autre';
  biography?: string;
  avatarUrl?: string;
  customBackground?: string;
  lockJournals?: boolean;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<boolean>;
  resetPreferences: () => void;
}
