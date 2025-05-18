
/**
 * Emotion Types
 * --------------------------------------
 * This file defines the official types for emotion detection and tracking functionality.
 * Any new property or correction must be documented here and synchronized across all mockData and components.
 */

// Emotion intensity can be represented as a string or number (0-1)
export type EmotionIntensity = 'very low' | 'low' | 'medium' | 'high' | 'very high' | 'very_low' | 'very_high' | number;

export interface EmotionResult {
  id: string;
  emotion: string; // Primary detected emotion
  confidence: number; // Confidence score (0-1)
  score: number; // Normalized score (0-100)
  intensity: number; // Use number for unified intensity representation
  emojis: string[]; // Associated emoji characters
  text?: string; // Text that was analyzed
  feedback?: string; // Feedback about the emotion
  timestamp?: string; // ISO timestamp when the emotion was detected
  metadata?: Record<string, any>; // Any additional data
  // Legacy properties for compatibility
  detected_emotion?: string;
  detectedEmotion?: string;
  predicted_emotion?: string;
  predictedEmotion?: string;
  emotion_label?: string;
  emotionLabel?: string;
  primary_emotion?: string;
  primaryEmotion?: string;
  secondary_emotions?: Record<string, number>;
  secondaryEmotions?: Record<string, number>;
  emotion_score?: number;
  emotionScore?: number;
}

export interface EmotionData {
  user_id: string; // Official snake_case property
  userId?: string; // Compatibility camelCase property
  date: string;
  emotion: string;
  intensity: number;
  context?: string;
  activity?: string;
  notes?: string;
  source?: 'manual' | 'scan' | 'ai' | 'chat' | 'vr' | 'system';
  related_entries?: string[];
  relatedEntries?: string[]; // Compatibility
}

export interface EmotionTrend {
  emotion: string;
  count: number;
  average_intensity: number;
  averageIntensity?: number; // Compatibility
  first_occurrence: string;
  firstOccurrence?: string; // Compatibility
  last_occurrence: string;
  lastOccurrence?: string; // Compatibility
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface MoodData {
  date: string;
  value: number;
  mood: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

// Re-export EmotionIntensity as string for compatibility
export type EmotionIntensityString = 'very low' | 'low' | 'medium' | 'high' | 'very high' | 'very_low' | 'very_high';

export interface EmotionPrediction {
  emotion: string;
  probability: number;
  timestamp: string;
  source: string;
}

export interface EmotionalData {
  id: string;
  user_id: string; // Official snake_case property
  userId?: string; // Compatibility camelCase property
  emotion: string;
  intensity: number;
  timestamp: string;
  source: string;
  text?: string;
  context?: string;
  metadata?: Record<string, any>;
}
