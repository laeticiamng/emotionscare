
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export interface UserPreferences {
  theme: string;
  language: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  fontSize?: string;
  fontFamily?: string;
  colorAccent?: string;
  soundEffects?: boolean;
  privacySettings?: string | PrivacyPreferences;
  accessibilitySettings?: AccessibilitySettings;
}

export interface PrivacyPreferences {
  dataSharing: boolean;
  analytics: boolean;
  thirdParty: boolean;
  shareData?: boolean;
  anonymizeReports?: boolean;
  profileVisibility?: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  role?: UserRole | string;
  avatar_url?: string;
  avatarUrl?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  department?: string;
  jobTitle?: string;
  preferences?: UserPreferences;
  emotionalScore?: number;
}

export interface UserWithStatus extends User {
  status?: 'active' | 'inactive' | 'pending' | 'blocked';
  lastSeen?: string;
  onlineStatus?: 'online' | 'offline' | 'away' | 'busy';
}

export interface Profile {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole | string;
  department?: string;
  job_title?: string;
  jobTitle?: string;
  avatar_url?: string;
  avatarUrl?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  emotional_score?: number;
  emotionalScore?: number;
  preferences?: UserPreferences;
}

export function isUserAdmin(user?: User | null): boolean {
  return user?.role === 'admin' || user?.role === 'b2b_admin';
}

export function getUserDisplayName(user?: User | null): string {
  if (!user) return 'Guest';
  return user.name || user.email || 'Unknown User';
}

export function mapProfileToUser(profile: Profile): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email || '',
    role: profile.role,
    department: profile.department,
    jobTitle: profile.job_title || profile.jobTitle,
    avatar_url: profile.avatar_url,
    avatarUrl: profile.avatar_url,
    created_at: profile.created_at,
    createdAt: profile.created_at,
    updated_at: profile.updated_at,
    updatedAt: profile.updated_at,
    emotionalScore: profile.emotional_score || profile.emotionalScore,
    preferences: profile.preferences
  };
}
