
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
