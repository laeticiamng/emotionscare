
import { Theme, FontFamily, FontSize } from './theme';
import { Badge } from './gamification';

export type UserModeType = 'personal' | 'professional' | 'team' | 'admin';

export interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
  isAdmin: boolean;
  isTeamLead: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  text?: string;
  mood: string;
  mood_score?: number;
  emotion?: string;
  date: Date | string;
  tags?: string[];
  ai_feedback?: string;
  user_id?: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  preferences?: UserPreferences;
  team_id?: string;
  teamId?: string;
  avatar?: string;
  department?: string;
  department_id?: string;
  position?: string;
  created_at?: string;
  createdAt?: string;
  joined_at?: string;
  onboarded?: boolean;
  emotional_score?: number;
}

export type UserRole = 'admin' | 'user' | 'team_lead' | 'manager' | 'guest';

export interface UserPreferences {
  theme?: Theme;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  notifications?: boolean;
  language?: string;
  notifications_enabled?: boolean;
  privacy?: string;
  profileVisibility?: string;
  dashboardLayout?: any;
}

export interface UserPreferencesState {
  theme?: Theme;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
}

export interface AuthContextType {
  user: User | null;
  profile?: User;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

export interface InvitationVerificationResult {
  valid: boolean;
  expired?: boolean;
  alreadyAccepted?: boolean;
  error?: string;
  invitation?: {
    id: string;
    email: string;
    role: string;
    expiresAt: string;
  };
}

export type DashboardLayout = Record<string, {
  x: number;
  y: number;
  w: number;
  h: number;
}>;

export interface NotificationPreferences {
  enabled: boolean;
  email: boolean;
  push: boolean;
  categories?: {
    system: boolean;
    activity: boolean;
    social: boolean;
    marketing: boolean;
  };
  frequency: string;
}
