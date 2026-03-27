// @ts-nocheck
/**
 * Utility service for emotion-related calculations and transformations
 */

/**
 * Calculates a numeric score based on detected emotion
 * @param emotion The detected emotion string
 * @returns A score between 0-100 representing emotional wellbeing
 */
export function calculateScoreFromEmotion(emotion: string): number {
  switch (emotion.toLowerCase()) {
    case 'happy': return 75;
    case 'excited': return 85;
    case 'joy': return 80;
    case 'calm': return 65;
    case 'neutral': return 50;
    case 'anxious': return 35;
    case 'sad': return 25;
    case 'angry': return 20;
    case 'frustrated': return 30;
    default: return 50;
  }
}

/**
 * Maps an emotion to a color for UI display
 * @param emotion The detected emotion string
 * @returns A color hex code
 */
export function getEmotionColor(emotion: string): string {
  switch (emotion.toLowerCase()) {
    case 'happy':
    case 'excited':
    case 'joy':
      return '#4CAF50'; // green
    case 'calm':
      return '#2196F3'; // blue
    case 'neutral':
      return '#9E9E9E'; // grey
    case 'anxious':
      return '#FFC107'; // amber
    case 'sad':
      return '#2196F3'; // blue
    case 'angry':
    case 'frustrated':
      return '#F44336'; // red
    default:
      return '#9E9E9E'; // grey
  }
}

/**
 * Gets an appropriate emoji for a detected emotion
 * @param emotion The detected emotion string
 * @returns An emoji character
 */
export function getEmotionEmoji(emotion: string): string {
  switch (emotion.toLowerCase()) {
    case 'happy': return '😊';
    case 'excited': return '😃';
    case 'joy': return '😄';
    case 'calm': return '😌';
    case 'neutral': return '😐';
    case 'anxious': return '😟';
    case 'sad': return '😢';
    case 'angry': return '😠';
    case 'frustrated': return '😤';
    default: return '😐';
  }
}

/**
 * Formats a date string for display in the UI
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatEmotionDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Ensures that date values are always strings before sending to database
 * @param date Date value that could be string or Date object
 * @returns ISO format date string
 */
export function ensureDateString(date: string | Date | undefined): string {
  if (!date) {
    return new Date().toISOString();
  }
  return date instanceof Date ? date.toISOString() : date;
}
