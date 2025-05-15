
export type UserRole = 'user' | 'admin' | 'manager' | 'guest' | string;

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: UserRole;
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
  last_login?: string;
  organization_id?: string;
  department_id?: string;
  team_id?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface UserPreferences {
  theme?: string;
  fontFamily?: string;
  fontSize?: string;
  notifications?: boolean | NotificationPreferences;
  dashboardLayout?: DashboardLayout;
  dataCollection?: {
    allowTracking?: boolean;
    shareAnonymousData?: boolean;
  };
}

export interface DashboardLayout {
  kpis?: {
    order: string[];
    visible: string[];
  };
  widgets?: {
    order: string[];
    visible: string[];
  };
}

export interface NotificationPreferences {
  email?: boolean;
  push?: boolean;
  inApp?: boolean;
  frequency?: string;
  types?: string[];
}

export interface UserPreferencesState {
  theme: string;
  fontSize: string;
  fontFamily: string;
  notifications: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

export interface InvitationVerificationResult {
  valid: boolean;
  message: string;
  email?: string;
  role?: string;
  invitation_id?: string;
  error?: string;
}
