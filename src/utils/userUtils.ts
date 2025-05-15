
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
    
    // If sound property exists, remove it as it's not in the type definition
    if ('sound' in harmonizedUser.preferences) {
      delete harmonizedUser.preferences.sound;
    }
    
    // If language property exists, remove it as it's not in the type definition
    if ('language' in harmonizedUser.preferences) {
      delete harmonizedUser.preferences.language;
    }
    
    // Ensure all required properties exist
    harmonizedUser.preferences = {
      theme: harmonizedUser.preferences.theme || 'system',
      fontSize: harmonizedUser.preferences.fontSize || 'medium',
      fontFamily: harmonizedUser.preferences.fontFamily || 'system',
      reduceMotion: harmonizedUser.preferences.reduceMotion || false,
      colorBlindMode: harmonizedUser.preferences.colorBlindMode || false,
      autoplayMedia: harmonizedUser.preferences.autoplayMedia !== undefined ? harmonizedUser.preferences.autoplayMedia : true,
      ...harmonizedUser.preferences
    };
  }
  
  return harmonizedUser as User;
};

export default harmonizeUserType;
