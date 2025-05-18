
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to combine class names with Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe function to get initials from a name
export function getInitials(name?: string, fallback = 'U'): string {
  if (!name) return fallback;
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Format date function
export function formatDate(date: Date | string): string {
  if (!date) return 'Date inconnue';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Format time function
export function formatTime(date: Date | string): string {
  if (!date) return '--:--';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Safely access nested properties
export function safeAccess<T, K extends keyof T>(obj: T, key: K, fallback: T[K]): T[K] {
  return obj && obj[key] !== undefined ? obj[key] : fallback;
}

// Handle compatibility between different property names
export function compatAccess<T>(obj: T, keys: (keyof T)[], fallback: any): any {
  if (!obj) return fallback;
  
  for (const key of keys) {
    if (obj[key] !== undefined) {
      return obj[key];
    }
  }
  
  return fallback;
}
