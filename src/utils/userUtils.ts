
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
export const harmonizeUserType = (user: User | TypesUser): User => {
  return {
    ...user,
    role: user.role || 'user',
    created_at: user.created_at || '',
    preferences: user.preferences ? {
      ...(user.preferences || {}),
      theme: user.preferences.theme || 'light',
      fontSize: user.preferences.fontSize || 'medium',
      fontFamily: user.preferences.fontFamily || 'system',
      reduceMotion: user.preferences.reduceMotion || false,
      colorBlindMode: user.preferences.colorBlindMode || false,
      autoplayMedia: user.preferences.autoplayMedia || true
    } : undefined
  } as User;
};
