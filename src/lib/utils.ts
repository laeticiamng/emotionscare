
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes with proper merging of overrides
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safe open helper to handle various drawer/modal open functions
 * Supports boolean values, parameterless functions and functions that take a boolean parameter
 */
export function safeOpen(value: boolean | (() => void) | ((open: boolean) => void)): void {
  if (typeof value === 'function') {
    try {
      // Try to call with true parameter for functions that take a boolean
      (value as (open: boolean) => void)(true);
    } catch (e) {
      // Fallback to calling without parameter for parameterless functions
      (value as () => void)();
    }
  }
  // If value is boolean, no action needed as it's just a passive value
}

/**
 * Formats seconds to minutes:seconds display (MM:SS)
 * @param seconds - Number of seconds to format
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  if (!seconds && seconds !== 0) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
}
