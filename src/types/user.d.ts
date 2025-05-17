
import { Theme, FontFamily, FontSize } from './theme';

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
  role?: 'user' | 'admin' | 'coach' | 'hr' | string;
  createdAt?: string;
  created_at?: string;
  joinedAt?: string;
  joined_at?: string;
  company?: string;
  department?: string;
  language?: string;
  preferences?: UserPreferences;
  emotional_score?: number;
  emotionalScore?: number;
}

export interface UserPreferences {
  theme: Theme;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  notifications?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  };
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  language?: string;
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  // Ajoutez d'autres préférences utilisateur selon les besoins
}
