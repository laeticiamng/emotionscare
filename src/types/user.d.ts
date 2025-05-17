
import { UserPreferences } from './preferences';

export type UserRole = 'user' | 'admin' | 'b2b_user' | 'b2b_admin' | 'b2b-user' | 'b2b-admin' | 'collaborator' | 'b2c' | 'viewer' | 'manager' | 'coach';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  avatarUrl?: string; // Pour compatibilité
  avatar_url?: string; // Pour compatibilité  
  created_at?: string;
  updated_at?: string;
  joined_at?: string;
  company_id?: string;
  department?: string;
  position?: string;
  location?: string;
  teams?: string[];
  status?: 'active' | 'inactive' | 'pending' | 'blocked';
  settings?: Record<string, any>;
  preferences?: UserPreferences;
  emotional_score?: number;
  onboarded?: boolean;
  language?: string;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
}
