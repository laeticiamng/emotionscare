
/**
 * Formats a duration in seconds to MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted string in MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Formats a date to a localized string representation
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', options).format(dateObj);
};

/**
 * Formats a number with comma separators for thousands
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR');
};

/**
 * Formats a timestamp to a relative time string (e.g., "il y a 5 minutes")
 * @param timestamp - Timestamp to format
 * @returns Relative time string
 */
export const formatRelativeTime = (timestamp: string | Date): string => {
  const now = new Date();
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return 'à l\'instant';
  } else if (diffMins < 60) {
    return `il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else if (diffDays < 30) {
    return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else {
    return formatDate(date, { day: 'numeric', month: 'short' });
  }
};
