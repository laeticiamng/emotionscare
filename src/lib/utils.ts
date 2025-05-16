
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Bonjour";
  } else if (hour >= 12 && hour < 18) {
    return "Bel après-midi";
  } else if (hour >= 18 && hour < 22) {
    return "Bonsoir";
  } else {
    return "Bienvenue";
  }
}

export function getThemeFromTime(): string {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 10) {
    return "morning";
  } else if (hour >= 10 && hour < 16) {
    return "afternoon";
  } else if (hour >= 16 && hour < 20) {
    return "evening";
  } else {
    return "night";
  }
}
