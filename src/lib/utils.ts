
import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Format a date string to a human-readable format
export function formatDate(dateString?: string, formatPattern: string = 'dd MMM yyyy'): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Date invalide';
    return format(date, formatPattern, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Erreur de format';
  }
}

// Class name utility function for merging tailwind classes
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Function to get user avatar URL
export function getUserAvatarUrl(user: any): string | undefined {
  return user?.avatar_url || user?.avatar || user?.image || undefined;
}

// Function to get user initials
export function getUserInitials(user: any): string {
  if (!user || !user.name) return '??';
  
  const names = user.name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return user.name.substring(0, 2).toUpperCase();
}

// Export all utility functions
export * from './safeOpen';
export * from './formatDate';
export * from './roleUtils';
export * from '@/lib/ai/gdpr-service';
