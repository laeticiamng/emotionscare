
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safely open a drawer by handling both boolean and function cases
export function safeOpen(setOpenDrawer: boolean | ((open: boolean) => void)) {
  if (typeof setOpenDrawer === 'function') {
    setOpenDrawer(true);
  }
  return true;
}

// Format duration in seconds to MM:SS
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) {
    return '0:00';
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Safe JSON parse with default value
export function safeJsonParse<T>(json: string | null | undefined, defaultValue: T): T {
  if (!json) return defaultValue;
  
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return defaultValue;
  }
}

// Generate a random ID (useful for non-production temporary IDs)
export function generateId(prefix = ''): string {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
