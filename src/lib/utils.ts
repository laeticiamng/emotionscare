
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format time in seconds to a readable format (mm:ss)
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Safe opener function to handle null/undefined URLs
export function safeOpen(url?: string | null): void {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
