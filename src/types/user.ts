
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin' | string;

export interface UserPreferences {
  theme?: string;
  fontSize?: string;
  fontFamily?: string;
  colorAccent?: string;
  language?: string;
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  soundEffects?: boolean;
  privacySettings?: PrivacyPreferences;
  accessibilitySettings?: AccessibilitySettings;
  dashboardLayout?: Record<string, any>;
  onboardingCompleted?: boolean;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    weekly?: boolean;
    insights?: boolean;
  };
  [key: string]: any;
}

export interface PrivacyPreferences {
  shareData?: boolean;
  anonymizedData?: boolean;
  analytics?: boolean;
  marketing?: boolean;
  [key: string]: boolean | undefined;
}

export interface AccessibilitySettings {
  reduceMotion?: boolean;
  highContrast?: boolean;
  largeText?: boolean;
  screenReader?: boolean;
  [key: string]: boolean | undefined;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  avatarUrl?: string;
  avatar?: string;
  department?: string;
  jobTitle?: string;
  job_title?: string;
  preferences?: UserPreferences;
  emotionalScore?: number;
  emotional_score?: number;
  position?: string;
  joined_at?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
}

export interface UserWithStatus extends User {
  status?: 'online' | 'offline' | 'away' | 'busy';
  lastActive?: string | Date;
}

// Helper types for API operations
export type CreateUserDto = Omit<User, 'id'> & {
  password?: string;
};

export type UpdateUserDto = Partial<User>;

export type UserAuthResponse = {
  user: User;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
};
