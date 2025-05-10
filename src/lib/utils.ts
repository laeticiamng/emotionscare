
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

// Safe opener function with overloads to handle different types of arguments
export function safeOpen(url?: string | null): void;
export function safeOpen(callback?: boolean | ((value: boolean) => void)): void;
export function safeOpen(arg?: string | null | boolean | ((value: boolean) => void)): void {
  if (typeof arg === 'string' && arg) {
    window.open(arg, '_blank', 'noopener,noreferrer');
  } else if (typeof arg === 'function') {
    arg(true);
  } else if (typeof arg === 'boolean') {
    // Just a boolean value, do nothing special
    return;
  }
}
