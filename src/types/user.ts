
/**
 * User Types
 * --------------------------------------
 * This file defines the official types for user functionality.
 */

export interface UserPreferences {
  shareData: boolean;
  anonymizedData: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  [key: string]: any; // Allow other preferences
}
