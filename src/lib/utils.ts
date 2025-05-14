
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from '@/types';

// Utility for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get user avatar URL with fallback
export function getUserAvatarUrl(user?: User | null): string {
  if (!user) return '';
  return user.avatar_url || `/images/avatars/default-${user.role || 'b2c'}.png`;
}

// Get user initials for avatar
export function getUserInitials(user?: User | null): string {
  if (!user || !user.name) return 'U';
  
  const nameParts = user.name.split(' ');
  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }
  
  return nameParts[0][0].toUpperCase();
}

// Format date for display
export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  try {
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString('fr-FR');
      case 'long':
        return dateObj.toLocaleDateString('fr-FR', { 
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      case 'medium':
      default:
        return dateObj.toLocaleDateString('fr-FR', { 
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

// Safe JSON parse with fallback
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    return fallback;
  }
}

// Format number with thousand separator
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Format time duration (seconds to MM:SS)
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
