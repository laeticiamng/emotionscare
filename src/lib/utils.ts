
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
