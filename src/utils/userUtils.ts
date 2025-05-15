import { User } from '@/types';

/**
 * Harmonizes user preferences to ensure all fields are correctly typed
 * This addresses the issue of different types for notifications between systems
 */
export const harmonizeUserType = (user: any): User => {
  if (!user) return null as unknown as User;
  
  // Create a copy to avoid mutations
  const harmonizedUser = { ...user };
  
  // If preferences exist, harmonize them
  if (harmonizedUser.preferences) {
    // Handle notifications which might be a boolean or an object
    if (typeof harmonizedUser.preferences.notifications === 'boolean') {
      // Convert boolean to object format
      harmonizedUser.preferences.notifications = {
        enabled: harmonizedUser.preferences.notifications,
        emailEnabled: harmonizedUser.preferences.notifications,
        pushEnabled: false,
        inAppEnabled: true,
        types: {
          system: true,
          emotion: true,
          coach: true,
          journal: true,
          community: true,
          achievement: true
        },
        frequency: 'daily'
      };
    } 
    
    // If sound property exists, ensure it's defined in the type
    if ('sound' in harmonizedUser.preferences) {
      // We'll keep it for backward compatibility
      harmonizedUser.preferences.soundEnabled = harmonizedUser.preferences.sound;
    }
    
    // If language property exists, ensure it's defined in the type
    if ('language' in harmonizedUser.preferences && !('langauge' in User)) {
      // We'll keep it for backward compatibility
    }
    
    // Ensure all required properties exist
    harmonizedUser.preferences = {
      theme: harmonizedUser.preferences.theme || 'system',
      fontSize: harmonizedUser.preferences.fontSize || 'medium',
      fontFamily: harmonizedUser.preferences.fontFamily || 'system',
      reduceMotion: harmonizedUser.preferences.reduceMotion || false,
      colorBlindMode: harmonizedUser.preferences.colorBlindMode || false,
      autoplayMedia: harmonizedUser.preferences.autoplayMedia !== undefined ? harmonizedUser.preferences.autoplayMedia : true,
      sound: harmonizedUser.preferences.sound || false,
      ...harmonizedUser.preferences
    };
  }
  
  return harmonizedUser as User;
};

/**
 * Gets the avatar URL for a user
 * @param user The user object
 * @returns The avatar URL or a default image if none is available
 */
export const getUserAvatarUrl = (user: User | null): string => {
  if (!user) return '/images/avatars/default.png';
  
  return user.avatar_url || user.avatar || '/images/avatars/default.png';
};

/**
 * Gets the initials from a user's name
 * @param user The user object
 * @returns The user's initials (first letter of first and last name)
 */
export const getUserInitials = (user: User | null): string => {
  if (!user || !user.name) return '??';
  
  const nameParts = user.name.trim().split(' ');
  
  if (nameParts.length === 0) return '?';
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (
    nameParts[0].charAt(0).toUpperCase() + 
    nameParts[nameParts.length - 1].charAt(0).toUpperCase()
  );
};

export default harmonizeUserType;
