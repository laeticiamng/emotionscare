
export interface UserPreferences {
  theme: 'light' | 'dark' | 'pastel' | 'system' | 'nature' | 'deep-night';
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

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  created_at?: string | Date;
  last_login?: string | Date;
  preferences?: UserPreferences;
}

export interface UserPreferencesState extends UserPreferences {
  loading: boolean;
  error: string | null;
  emotionalCamouflage?: boolean;
}
