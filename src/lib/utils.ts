
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely open something that could be a boolean, function, or URL
 */
export function safeOpen(target: boolean | string | (() => void)) {
  if (typeof target === 'function') {
    target();
  } else if (typeof target === 'string' && target.startsWith('http')) {
    window.open(target, '_blank', 'noopener,noreferrer');
  }
  
  // If it's a boolean, it's just a state value, do nothing
  return target;
}
