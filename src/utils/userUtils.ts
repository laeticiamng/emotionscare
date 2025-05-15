
import { User } from '@/types/user';
import { User as TypesUser } from '@/types/types';

export const getUserAvatarUrl = (user?: User | TypesUser | null): string => {
  if (!user) return '';
  return user.avatar_url || user.avatar || '';
};

export const getUserInitials = (user?: User | TypesUser | null): string => {
  if (!user || !user.name) return '';
  
  return user.name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// This function can help harmonize the two User types
export const harmonizeUserType = (user: User | TypesUser | null): User => {
  if (!user) return user as User;
  
  const preferences = user.preferences || {};
  
  // Convert preferences.notifications from boolean to object if needed
  const notifications = 
    typeof preferences.notifications === 'boolean' 
      ? { 
          enabled: !!preferences.notifications, 
          emailEnabled: false,
          types: {
            system: true,
            emotion: true,
            journal: true,
            coach: true,
            community: true,
            achievement: true
          },
          frequency: 'daily',
          tone: 'friendly'
        }
      : preferences.notifications || { 
          enabled: true, 
          emailEnabled: false,
          types: {
            system: true,
            emotion: true,
            journal: true,
            coach: true,
            community: true,
            achievement: true
          },
          frequency: 'daily',
          tone: 'friendly'
        };
  
  return {
    ...user,
    created_at: user.created_at || '',
    preferences: {
      ...(preferences || {}),
      theme: preferences.theme || 'light',
      fontSize: preferences.fontSize || 'medium',
      fontFamily: preferences.fontFamily || 'system',
      reduceMotion: preferences.reduceMotion !== undefined ? preferences.reduceMotion : false,
      colorBlindMode: preferences.colorBlindMode !== undefined ? preferences.colorBlindMode : false,
      autoplayMedia: preferences.autoplayMedia !== undefined ? preferences.autoplayMedia : true,
      notifications
    }
  } as User;
};
