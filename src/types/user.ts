
/**
 * User Types
 * --------------------------------------
 * This file defines the official types for user functionality.
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
  GUEST = 'GUEST'
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
