import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

// Format a date string to a human-readable format
export function formatDate(dateString?: string, formatPattern: string = 'dd MMM yyyy'): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Date invalide';
    return format(date, formatPattern, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Erreur de format';
  }
}

// Export all utility functions
export * from './safeOpen';
export * from './formatDate';
export * from './roleUtils';
export * from '@/lib/ai/gdpr-service';
