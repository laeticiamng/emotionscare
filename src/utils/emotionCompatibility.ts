
/**
 * Emotion Compatibility Utilities
 * ------------------------------
 * This file provides utility functions to help with compatibility
 * between different emotion data formats and property names.
 */

import { EmotionResult, EmotionIntensity } from '@/types/emotion';

/**
 * Converts string-based emotion intensity to numeric value
 * @param intensity The emotion intensity as string or number
 */
export const normalizeEmotionIntensity = (intensity: EmotionIntensity | number | undefined): number => {
  if (intensity === undefined) {
    return 0.5; // Default medium intensity
  }
  
  if (typeof intensity === 'number') {
    return intensity;
  }
  
  // Convert string intensity to number
  switch(intensity.toLowerCase()) {
    case 'very low':
    case 'very_low':
      return 0.1;
    case 'low':
      return 0.3;
    case 'medium':
      return 0.5;
    case 'high':
      return 0.7;
    case 'very high':
    case 'very_high':
      return 0.9;
    default:
      return 0.5;
  }
};

/**
 * Ensures an emotion result has all required properties with proper types
 */
export const normalizeEmotionResult = (result: Partial<EmotionResult>): EmotionResult => {
  return {
    id: result.id || `emotion-${Date.now()}`,
    emotion: result.emotion || 'neutral',
    confidence: result.confidence || 0.5,
    score: result.score || 0,
    intensity: normalizeEmotionIntensity(result.intensity),
    timestamp: result.timestamp || new Date().toISOString(),
    metadata: result.metadata || {},
    emojis: result.emojis || [],
    text: result.text || '',
    feedback: result.feedback || '',
    // Include other properties with defaults
    ...result
  };
};

/**
 * Gets the display name for an emotion
 */
export const getEmotionDisplayName = (emotionKey: string): string => {
  const emotionMap: Record<string, string> = {
    'happy': 'Happy',
    'sad': 'Sad',
    'angry': 'Angry',
    'fearful': 'Fearful',
    'disgusted': 'Disgusted',
    'surprised': 'Surprised',
    'calm': 'Calm',
    'confused': 'Confused',
    'neutral': 'Neutral',
    'focused': 'Focused',
    'relaxed': 'Relaxed',
    'stressed': 'Stressed',
    'anxious': 'Anxious'
  };
  
  return emotionMap[emotionKey.toLowerCase()] || emotionKey;
};
