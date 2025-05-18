
/**
 * Types officiels pour le domaine user.
 * Toute modification doit être synchronisée dans tous les mocks et composants.
 * Ne jamais dupliquer ce type en local.
 */

export interface User {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  role?: UserRole;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
  preferences?: UserPreferences;
  metadata?: Record<string, any>;
  organizationId?: string;
  departmentId?: string;
  position?: string;
  profileCompleted?: boolean;
  [key: string]: any; // Allow additional properties
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
  GUEST = 'GUEST',
  B2B_USER = 'b2b_user', // Added for compatibility with component checks
  B2B_ADMIN = 'b2b_admin' // Added for compatibility with component checks
}

export interface UserPreferences {
  shareData: boolean;
  anonymizedData: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  [key: string]: any; // Allow other preferences
}

export interface UserNotificationSettings {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  types: {
    system: boolean;
    emotion: boolean;
    coach: boolean;
    journal: boolean;
    community: boolean;
    achievement: boolean;
    badge: boolean;
  };
  frequency: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}
