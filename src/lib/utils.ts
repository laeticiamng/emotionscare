
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
 * Ensures that boolean values and functions both work properly
 */
export function safeOpen(value: boolean | (() => void)): void {
  if (typeof value === 'function') {
    value();
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
