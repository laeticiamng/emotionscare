
import { User } from '@/types/user';
import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date using date-fns
 */
export function formatDate(date: Date | string, formatString: string = 'PP') {
  if (!date) return '';
  return format(new Date(date), formatString);
}

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
