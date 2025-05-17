
import { UserPreferences } from './preferences';

export type UserRole = 'user' | 'admin' | 'b2b_user' | 'b2b_admin' | 'b2b-user' | 'b2b-admin' | 'collaborator' | 'b2c';

export interface User {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
  joined_at?: string;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
  company_id?: string;
  department?: string;
  position?: string;
  job_title?: string;
  settings?: Record<string, any>;
  preferences?: UserPreferences;
  emotional_score?: number;
  onboarded?: boolean;
  createdAt?: string;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  loading?: boolean;
  resetPreferences?: () => void;
}

// Export UserPreferences to make it accessible
export { UserPreferences } from './preferences';
