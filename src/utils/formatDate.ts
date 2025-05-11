
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date with different options
 * @param date Date to format
 * @param formatString Optional format string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | number, formatString?: string): string => {
  if (!date) return '';
  
  const dateObject = typeof date === 'string' ? new Date(date) : new Date(date);
  
  if (isNaN(dateObject.getTime())) {
    console.error('Invalid date provided to formatDate:', date);
    return '';
  }
  
  // Use the provided format or default to day/month/year
  return format(dateObject, formatString || 'dd/MM/yyyy', { locale: fr });
};

/**
 * Format a date relative to now (e.g., "2 days ago")
 * @param date Date to format
 * @returns Relative date string
 */
export const formatRelativeDate = (date: Date | string | number): string => {
  if (!date) return '';
  
  const dateObject = typeof date === 'string' ? new Date(date) : new Date(date);
  
  if (isNaN(dateObject.getTime())) {
    console.error('Invalid date provided to formatRelativeDate:', date);
    return '';
  }
  
  return formatDistanceToNow(dateObject, { addSuffix: true, locale: fr });
};

export default formatDate;
