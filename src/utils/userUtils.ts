
import { User as AuthUser } from '@/types/auth';
import { User as UserModelUser } from '@/types/user';

/**
 * Harmonizes the user type between the different definitions in the codebase
 * This helps address issues where some components expect one type of User and others expect another
 */
export const harmonizeUserType = (user: any): AuthUser => {
  if (!user) return null as unknown as AuthUser;
  
  // Ensure we have at least these required fields
  return {
    id: user.id || '',
    email: user.email || '',
    name: user.name || '',
    role: user.role || 'user',
    avatar_url: user.avatar_url || user.avatar || '',
    onboarded: user.onboarded || false,
    created_at: user.created_at || user.createdAt || new Date().toISOString(),
    preferences: user.preferences || {}
  };
};

/**
 * Get user's avatar URL safely, with a fallback
 */
export const getUserAvatarUrl = (user: AuthUser | UserModelUser | null): string => {
  if (!user) return '';
  return user.avatar_url || (user as any).avatar || '';
};

/**
 * Get user's initials for avatar fallback
 */
export const getUserInitials = (user: AuthUser | UserModelUser | null): string => {
  if (!user || !user.name) return '?';
  
  const names = user.name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Get user's display name, with fallbacks
 */
export const getUserDisplayName = (user: AuthUser | UserModelUser | null): string => {
  if (!user) return 'Utilisateur';
  
  if (user.name) {
    return user.name;
  }
  
  // Try to create a display name from the email if available
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'Utilisateur';
};
