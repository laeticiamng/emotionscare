
import { UserPreferences } from './preferences';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  image?: string;
  preferences: UserPreferences;
  onboarded?: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  position?: string;
  department?: string;
  location?: string;
  joining_date?: string;
  created_at: string;
  updated_at: string;
}
