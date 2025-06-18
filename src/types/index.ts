
// Types globaux de l'application
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'b2c' | 'b2b_user' | 'b2b_admin';
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en';
  notifications_enabled: boolean;
  email_notifications: boolean;
  privacy_settings: PrivacySettings;
}

export interface PrivacySettings {
  camera_enabled: boolean;
  microphone_enabled: boolean;
  heart_rate_enabled: boolean;
  gps_enabled: boolean;
  social_sharing_enabled: boolean;
  nft_enabled: boolean;
}

export interface EmotionData {
  id: string;
  user_id: string;
  emotion_type: 'joy' | 'calm' | 'energy' | 'focus' | 'stress' | 'neutral';
  intensity: number; // 1-10
  source: 'voice' | 'text' | 'camera' | 'manual';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  premium: boolean;
  enabled: boolean;
  category: 'emotion' | 'analytics' | 'wellness' | 'social';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
