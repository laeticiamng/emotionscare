
/**
 * Utility functions for formatting values
 */

/**
 * Format time in MM:SS format
 * @param seconds - The time in seconds
 * @returns Formatted time string (MM:SS)
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Format a date to a human-readable string
 * @param date - The date to format
 * @param includeTime - Whether to include the time
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, includeTime = false): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return dateObj.toLocaleDateString('fr-FR', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date invalide';
  }
};

/**
 * Format a number as a percentage
 * @param value - The value to format (0-1)
 * @param precision - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, precision = 0): string => {
  if (isNaN(value)) return '0%';
  
  const percentage = value * 100;
  return `${percentage.toFixed(precision)}%`;
};

/**
 * Format a score (0-100) with an appropriate unit
 * @param score - The score to format
 * @returns Formatted score string
 */
export const formatScore = (score: number): string => {
  if (isNaN(score)) return '0 pts';
  return `${Math.round(score)} pts`;
};

/**
 * Safely convert a variety of emotion data formats
 * @param value - The value to normalize
 * @returns A consistent object structure
 */
export const normalizeEmotionData = (value: any) => {
  if (!value) return null;
  
  return {
    emotion: value.emotion || 'neutral',
    score: value.score || value.intensity || (value.confidence ? value.confidence * 100 : 50),
    date: value.date || value.timestamp || new Date().toISOString(),
    text: value.text || value.transcript || '',
    emojis: Array.isArray(value.emojis) ? value.emojis : 
            (typeof value.emojis === 'string' ? value.emojis.split('') : [])
  };
};
