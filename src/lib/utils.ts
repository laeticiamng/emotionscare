
import { User } from '@/types/user';

/**
 * Get the user's avatar URL from the user object
 * @param user User object
 * @returns Avatar URL or empty string
 */
export function getUserAvatarUrl(user: User | null) {
  if (!user) return '';
  
  return user.avatar_url || user.avatar || user.image || '';
}

/**
 * Get the user's initials from the user object
 * @param user User object
 * @returns Initials (up to 2 characters)
 */
export function getUserInitials(user: User | null) {
  if (!user || !user.name) return 'U';
  
  const names = user.name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}
