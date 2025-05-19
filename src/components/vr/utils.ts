
/**
 * Utility functions for VR components
 */

/**
 * Converts a duration value to a number
 */
export function durationToNumber(duration: string | number | undefined): number {
  if (typeof duration === 'number') return duration;
  if (typeof duration === 'string') {
    return parseFloat(duration) || 0;
  }
  return 0;
}

/**
 * Formats duration as a human-readable string
 */
export function formatDuration(duration: string | number | undefined): string {
  const minutes = durationToNumber(duration);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}
