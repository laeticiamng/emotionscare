
export interface AuthContextType {
  user: {
    id: string;
    name?: string;
    email: string;
    role?: string;
    preferences?: UserPreferences;
    [key: string]: any;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updatePreferences?: (preferences: UserPreferences) => Promise<void>;
  updateUser?: (user: any) => Promise<void>;
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
    enabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    types?: {
      system: boolean;
      emotion: boolean;
      coach: boolean;
      journal: boolean;
      community: boolean;
      achievement: boolean;
    };
    frequency?: string;
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacy?: {
    shareData: boolean;
    anonymizeReports: boolean;
    profileVisibility: string;
  };
  [key: string]: any;
}
