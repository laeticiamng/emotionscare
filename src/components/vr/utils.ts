
import { VRSessionTemplate, VRDifficulty } from '@/types/vr';

/**
 * Convert duration value to a number (minutes)
 */
export function durationToNumber(duration: number | string): number {
  if (typeof duration === 'string') {
    return parseFloat(duration) || 0;
  }
  return duration || 0;
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: string | number): string {
  const mins = durationToNumber(minutes);
  if (mins < 60) {
    return `${mins} min`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

/**
 * Get CSS class based on difficulty
 */
export function getDifficultyClass(difficulty: string): string {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
    case 'easy':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    case 'intermediate':
    case 'medium':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'advanced':
    case 'hard':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'expert':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
}

// Re-export normalizeDifficulty for legacy imports
export { normalizeDifficulty } from '@/utils/vrUtils';
