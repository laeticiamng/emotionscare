
import { User } from '@/types/user';

/**
 * Get user avatar URL from various possible properties
 * @param user User object that might contain avatar, avatar_url or image
 * @returns Avatar URL or undefined if none found
 */
export function getUserAvatarUrl(user?: User | null): string | undefined {
  if (!user) return undefined;
  
  // Try all possible avatar properties
  return user.avatar_url || user.avatar || user.image;
}

/**
 * Get user initials for avatar fallback
 * @param user User object
 * @returns User initials (1-2 characters)
 */
export function getUserInitials(user?: User | null): string {
  if (!user?.name) return '?';
  
  const parts = user.name.split(' ')
    .filter(part => part.length > 0)
    .map(part => part[0]?.toUpperCase() || '');
  
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0];
  return `${parts[0]}${parts[parts.length - 1]}`;
}
