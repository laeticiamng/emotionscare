
// Re-export all types from respective type files
export type {
  User,
  UserPreferences,
  PrivacySettings,
  AuthState,
  LoginFormData,
  RegisterFormData,
  UserMode
} from './auth';

export type {
  LayoutContextType,
  LayoutProviderProps,
  ShellProps,
  NavigationItem,
  NavigationSection
} from './layout';

export type {
  Theme,
  ThemeContextType,
  ThemeOption,
  FontFamily,
  FontSize,
  ThemeName
} from './theme';

export type {
  SidebarContextType,
  SidebarProviderProps,
  SidebarItem,
  SidebarSection
} from './sidebar';

export type {
  UserModeType
} from './userMode';

// Types globaux de l'application
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

export interface EmotionData {
  id: string;
  user_id: string;
  emotion_type: 'joy' | 'calm' | 'energy' | 'focus' | 'stress' | 'neutral';
  intensity: number; // 1-10
  source: 'voice' | 'text' | 'camera' | 'manual';
  metadata?: Record<string, any>;
  created_at: string;
}
