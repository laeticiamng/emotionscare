
export type UserRole = 'user' | 'admin' | 'coach' | 'therapist' | 'b2b_user';

export interface UserPreferences {
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  theme?: ThemeName;
  fontSize?: FontSize;
  language?: string;
  fontFamily?: FontFamily;
  sound?: boolean;
  notifications?: NotificationPreference;
  // Added fields from error messages
  privacy?: {
    profileVisibility?: 'public' | 'private' | 'team';
  };
  notifications_enabled?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  aiSuggestions?: boolean;
  emotionalCamouflage?: boolean;
}

export type ThemeName = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'system-ui' | 'serif' | 'mono';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  preferences: UserPreferences;
  avatar_url?: string;
  created_at?: string;
  // Added fields from error messages
  avatar?: string;
  joined_at?: string;
  onboarded?: boolean;
  department?: string;
  position?: string;
  anonymity_code?: string;
  emotional_score?: number;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  setSinglePreference: (key: string, value: any) => void;
  resetPreferences: () => void;
  loading: boolean;
}

export interface InvitationVerificationResult {
  valid: boolean;
  role?: string;
  email?: string;
  expired?: boolean;
  error?: string;
}

export interface UserData extends User {
  status: 'pending' | 'active';
  createdAt: string;
  location?: any;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, name: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  preferences: UserPreferencesState;
  logout: () => Promise<void>;
}
