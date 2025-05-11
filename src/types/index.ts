// Export all types from their respective files
export * from './user';
export * from './preferences';
export * from './music';
export * from './chat';
export * from './journal';
export * from './emotion';
export * from './coach';
export * from './vr';
export * from './breathing';
export * from './analytics';
export * from './invitation';
export * from './audio';
export * from './storytelling';
export * from './notifications';
export * from './onboarding';
export * from './activity';

// Export an interface for the MusicTrack with the corrected properties
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  url?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string; // Added
  audio_url?: string;
  audioUrl?: string;
  emotion?: string;
  genre?: string; // Added
  mood?: string;  // Added
}

// Export a UserPreferences interface with the corrected properties
export interface UserPreferences {
  theme?: string;
  // Fix duplicate notifications by having only one definition
  notifications?: boolean | {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  soundEnabled?: boolean;
  language?: string;
  fontFamily?: string;
  fontSize?: string;
  privacyLevel?: string; // Added
  privacy?: 'public' | 'private' | 'friends';
  font?: string; // Added
  showEmotionPrompts?: boolean;
  notification_frequency?: string;
  notification_tone?: string;
  notification_type?: string;
  emotionalCamouflage?: boolean;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
}
