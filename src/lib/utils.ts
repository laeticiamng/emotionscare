
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeOpen(url: string, target: string = '_blank') {
  // Safely open a URL in a new tab/window
  const safeUrl = url.startsWith('http') ? url : `https://${url}`;
  window.open(safeUrl, target, 'noopener,noreferrer');
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Non disponible';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date invalide';
  }
}
