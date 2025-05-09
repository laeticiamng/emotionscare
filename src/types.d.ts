
export type ThemeName = 'light' | 'dark' | 'pastel' | 'system' | 'nature' | 'deep-night';

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
