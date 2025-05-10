
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: UserRole;
  created_at?: string | Date;
  last_login?: string | Date;
  preferences?: UserPreferences;
  metadata?: Record<string, any>;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  COACH = 'coach',
  PREMIUM = 'premium'
}

export interface UserPreferences {
  theme: ThemeName;
  notifications_enabled: boolean;
  font_size: 'small' | 'medium' | 'large';
  language: string;
  accent_color?: string;
  background_color?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  reminder_time?: string;
  dynamic_theme?: {
    enable_time_based?: boolean;
    enable_emotion_based?: boolean;
    enable_weather_based?: boolean;
  };
  accessibility?: {
    high_contrast?: boolean;
    reduced_motion?: boolean;
    screen_reader_optimized?: boolean;
    keyboard_navigation?: boolean;
  };
  audio?: {
    volume?: number;
    continue_playback?: boolean;
    ambient_sound?: string;
    context_music?: boolean;
    immersive_mode?: boolean;
  };
  data_preferences?: {
    export_format?: 'json' | 'pdf';
    incognito_mode?: boolean;
    data_retention_period?: number;
  };
}

export interface UserPreferencesState {
  theme: ThemeName;
  notificationsEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  accentColor?: string;
  backgroundColor?: string;
  notifications?: {
    journal: boolean;
    breathing: boolean;
    music: boolean;
  };
  reminderTime?: string;
  dynamicTheme?: {
    enableTimeBased?: boolean;
    enableEmotionBased?: boolean;
    enableWeatherBased?: boolean;
  };
  accessibility?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    screenReaderOptimized?: boolean;
    keyboardNavigation?: boolean;
  };
  audio?: {
    volume?: number;
    continuePlayback?: boolean;
    ambientSound?: string;
    contextMusic?: boolean;
    immersiveMode?: boolean;
  };
  dataPreferences?: {
    exportFormat?: 'json' | 'pdf';
    incognitoMode?: boolean;
    dataRetentionPeriod?: number;
  };
}

export type NotificationTone = 'minimalist' | 'poetic' | 'directive' | 'silent';
