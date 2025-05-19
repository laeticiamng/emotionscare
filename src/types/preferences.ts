
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  fontSize?: 'small' | 'medium' | 'large';
  fontFamily?: 'sans' | 'serif' | 'mono';
  notifications?: boolean;
  emailNotifications?: boolean;
  soundEffects?: boolean;
  animationReduced?: boolean;
  highContrast?: boolean;
  language?: string;
  dateFormat?: string;
  timeFormat?: string;
}

export interface UserPreferencesFormProps {
  preferences: UserPreferences;
  onSave: (values: Partial<UserPreferences>) => Promise<void>;
  isLoading?: boolean;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
}
