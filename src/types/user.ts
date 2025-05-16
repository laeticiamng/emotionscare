
export type UserRole = 'user' | 'admin' | 'therapist' | 'coach' | 'b2c' | 'b2b_admin' | 'b2b_user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  avatar_url?: string;
  position?: string;
  department?: string;
  emotional_score?: number;
}

export interface UserPreferences {
  theme: string;
  fontSize: string;
  fontFamily: string;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  soundEnabled: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    frequency: string;
  };
}

export interface UserPreferencesState {
  theme: string;
  fontSize: string;
  fontFamily: string;
  accessibility: {
    reduceMotion: boolean;
    colorBlindMode: boolean;
  };
  media: {
    autoplay: boolean;
    sound: boolean;
  };
  notifications: {
    channels: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    frequency: string;
  };
}

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  role?: UserRole;
  message?: string;
  invitationId?: string;
  expires_at?: string;
}
