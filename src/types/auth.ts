
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
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<any>;
  updatePreferences?: (preferences: Partial<UserPreferences>) => Promise<void>;
  updateUser?: (user: any) => Promise<void>;
  clearError?: () => void;
}

export interface UserPreferences {
  theme: "system" | "dark" | "light" | "pastel";
  fontSize: string;
  fontFamily: string;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  soundEnabled: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    types: {
      system: boolean;
      emotion: boolean;
      coach: boolean;
      journal: boolean;
      community: boolean;
      achievement: boolean;
    };
    frequency: string;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy?: {
    shareData: boolean;
    anonymizeReports: boolean;
    profileVisibility: string;
  };
  dashboardLayout?: Record<string, any> | string;
  onboardingCompleted?: boolean;
  [key: string]: any;
}
