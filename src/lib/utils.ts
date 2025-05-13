
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with TailwindCSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date with options
 */
export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return dateObj.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

/**
 * Get a user's avatar URL or generate one
 */
export function getUserAvatarUrl(user: { name?: string; avatar?: string; image?: string; avatar_url?: string; }): string {
  if (user.avatar) return user.avatar;
  if (user.image) return user.image;
  if (user.avatar_url) return user.avatar_url;
  
  // Generate a placeholder avatar with initials
  return `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'User'}`;
}

/**
 * Get a user's initials from their name
 */
export function getUserInitials(name?: string): string {
  if (!name) return 'UN';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return name.substring(0, 2).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
