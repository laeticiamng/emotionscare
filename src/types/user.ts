
import { UserPreferences } from './preferences';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  HR = 'hr',
  MANAGER = 'manager',
  GUEST = 'guest'
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
  department?: string;
  position?: string;
  bio?: string;
  isActive?: boolean;
  lastLogin?: string;
  team_id?: string;
  team_role?: string;
  isAnonymous?: boolean;
  manager_id?: string;
  phone?: string;
  badges?: string[];
  level?: number;
  points?: number;
  personal_data?: {
    [key: string]: any;
  }
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  isLoading?: boolean;
  error?: string | null;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<boolean>;
  resetPreferences: () => void;
  theme?: string;
  fontSize?: string;
  notifications_enabled?: boolean;
  notification_frequency?: string;
  notification_type?: string;
  notification_tone?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  emotionalCamouflage?: boolean;
}
