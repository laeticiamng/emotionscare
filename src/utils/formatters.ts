
/**
 * Format a time duration in seconds to MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format a date string or Date object to a readable format
 */
export const formatDate = (date: string | Date, short: boolean = false): string => {
  if (!date) return '';
  
  const options: Intl.DateTimeFormatOptions = short 
    ? { month: 'short', day: 'numeric' } 
    : { year: 'numeric', month: 'long', day: 'numeric' };
  
  return new Date(date).toLocaleDateString('fr-FR', options);
};

/**
 * Format a date string or Date object to include the time
 */
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleDateString('fr-FR', options);
};

/**
 * Calculate time elapsed since a given date
 */
export const timeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  
  if (diffSec < 60) return 'À l\'instant';
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHour < 24) return `Il y a ${diffHour} h`;
  if (diffDay < 7) return `Il y a ${diffDay} j`;
  
  return formatDate(date, true);
};

/**
 * Format a number with a specified number of decimal places
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  if (isNaN(num)) return '0';
  
  return num.toFixed(decimals);
};
