
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from '@/types';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date in a readable format
 */
export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Get user avatar URL with fallback to default
 */
export function getUserAvatarUrl(user: User | null | undefined): string {
  if (!user) return '/avatars/default-avatar.png';
  return user.avatar_url || user.image || '/avatars/default-avatar.png';
}

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(user: User | null | undefined): string {
  if (!user || !user.name) return 'U';
  
  const names = user.name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  
  return names[0].substring(0, 2).toUpperCase();
}
