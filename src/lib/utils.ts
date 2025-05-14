
import { User } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for combining class names with clsx and tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate user initials from name
export function getUserInitials(user: User | string): string {
  // If user is a string, use it directly
  const name = typeof user === 'string' ? user : (user?.name || '');
  
  if (!name) return '';
  
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Get user avatar URL or default placeholder
export function getUserAvatarUrl(user: User): string {
  if (user.avatar_url) return user.avatar_url;
  if (user.avatar) return user.avatar;
  
  // Default avatar using initials
  const initials = getUserInitials(user);
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-pink-500', 'bg-purple-500', 'bg-indigo-500'
  ];
  
  // Use user ID to consistently pick a color
  const colorIndex = user.id.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];
  
  // In a real app, you might use a service like UI Avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color.replace('bg-', '')}&color=fff`;
}

// Format date for consistent display
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
}
