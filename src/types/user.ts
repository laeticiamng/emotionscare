
export type UserRole = 'admin' | 'user' | 'manager' | 'employee' | 'guest';

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  avatar_url?: string;
  image?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  role?: UserRole;
  department?: string;
  emotional_score?: number;
  anonymity_code?: string;
}

export interface UserPreferences {
  theme: string;
  notifications: boolean;
  language: string;
  fontSize: string;
  autoplayVideos: boolean;
  showEmotionPrompts: boolean;
  privacyLevel: string;
  dataCollection: boolean;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
}
