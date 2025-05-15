
export type UserRole = 'admin' | 'user' | 'manager' | 'coach';

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  role?: UserRole;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: string;
  fontSize?: string;
  fontFamily?: string;
  notifications?: NotificationPreference;
}

export interface UserPreferencesState {
  theme: string;
  fontSize: string;
  fontFamily: string;
  notifications: boolean | NotificationPreference;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export type ThemeName = 'light' | 'dark' | 'system';

export interface InvitationVerificationResult {
  valid: boolean;
  expired?: boolean;
  alreadyAccepted?: boolean;
  error?: string;
  invitation?: {
    id: string;
    email: string;
    role: string;
    expiresAt: string;
  };
}
