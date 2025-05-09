
/**
 * Utility functions related to time
 */

/**
 * Returns the time of day (morning, afternoon, evening) based on the current hour
 */
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

/**
 * Returns a greeting based on the time of day
 */
export function getGreeting(): string {
  const timeOfDay = getTimeOfDay();
  
  switch (timeOfDay) {
    case 'morning':
      return 'Bonjour';
    case 'afternoon':
      return 'Bon après-midi';
    case 'evening':
      return 'Bonsoir';
    default:
      return 'Bonjour';
  }
}

/**
 * Formats a date in French locale (e.g., "lundi 12 mai 2023")
 */
export function formatDateFr(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Returns whether two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Returns a relative time string (e.g., "il y a 3 jours", "aujourd'hui")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (isSameDay(now, date)) {
    return "aujourd'hui";
  } else if (diffDays === 1) {
    return date < now ? "hier" : "demain";
  } else if (diffDays < 7) {
    return date < now ? `il y a ${diffDays} jours` : `dans ${diffDays} jours`;
  } else {
    return formatDateFr(date);
  }
}
