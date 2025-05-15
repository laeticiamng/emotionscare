
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
