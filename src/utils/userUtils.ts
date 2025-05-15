
import { User } from '@/types/user';

/**
 * Harmonizes user object to ensure consistency across different sources
 * This is needed to fix type conflicts in PreferencesForm.tsx
 */
export function harmonizeUserType(user: any): User {
  if (!user) return null;
  
  // Create a normalized preferences object
  const normalizedPreferences = user.preferences ? {
    ...user.preferences,
    // Ensure notifications has the right format
    notifications: typeof user.preferences.notifications === 'boolean' 
      ? { enabled: user.preferences.notifications, emailEnabled: false }
      : user.preferences.notifications || { enabled: true, emailEnabled: false }
  } : undefined;
  
  // Return the harmonized user
  return {
    ...user,
    preferences: normalizedPreferences
  };
}

/**
 * Gets the avatar URL for a user or returns undefined if not available
 */
export function getUserAvatarUrl(user: User | null): string | undefined {
  if (!user) return undefined;
  return user.avatar_url;
}

/**
 * Gets the initials from a user's name
 */
export function getUserInitials(user: User | null): string {
  if (!user || !user.name) return '?';
  
  const nameParts = user.name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Gets the user's display name, with fallback to email if name not available
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  return user.name || user.email.split('@')[0];
}
