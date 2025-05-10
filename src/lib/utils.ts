
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely open something that could be a boolean, function, or URL
 * Now handles functions that may accept parameters
 */
export function safeOpen(target: string | boolean | ((arg?: any) => void), arg?: any) {
  if (typeof target === 'function') {
    // Check if the function expects parameters
    if (arg !== undefined) {
      target(arg);
    } else {
      target();
    }
  } else if (typeof target === 'string' && target.startsWith('http')) {
    window.open(target, '_blank', 'noopener,noreferrer');
  } else if (typeof target === 'boolean') {
    // For boolean values, return as is
    return target;
  }
  
  return target;
}

/**
 * Format seconds to minutes:seconds format
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
