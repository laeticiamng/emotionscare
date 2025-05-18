
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatarUrl?: string;
  department?: string;
  preferences?: UserPreferences;
  metadata?: Record<string, any>;
  permissions?: string[];
  isAdmin?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system' | 'pastel';
  language: string;
  emailNotifications: boolean;
  notificationsEnabled: boolean;
  accessibility?: AccessibilityPreferences;
  privacy?: PrivacyPreferences;
}

export interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reduceMotion: boolean;
  soundEffects: boolean;
}

export interface PrivacyPreferences {
  dataSharing: boolean;
  analytics: boolean;
  thirdParty: boolean;
  profileVisibility?: 'public' | 'private' | 'contacts';
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'fr',
  emailNotifications: true,
  notificationsEnabled: true,
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    soundEffects: true,
  },
  privacy: {
    dataSharing: true,
    analytics: true,
    thirdParty: false,
    profileVisibility: 'public'
  }
};
