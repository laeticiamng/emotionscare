
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ensureValidUUID(id: string): string {
  // Vérifier si c'est déjà un UUID valide
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  
  // Générer un UUID déterministe basé sur l'identifiant fourni
  // Pour garantir que le même ID produira toujours le même UUID
  const paddedId = id.padStart(12, '0').substring(0, 12);
  return `00000000-0000-0000-0000-${paddedId}`;
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
