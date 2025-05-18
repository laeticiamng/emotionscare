
/**
 * Emotional Data Types
 * --------------------------------------
 * This file defines types for emotional data tracking and analysis.
 * Any new property or correction must be documented here and synchronized across all components.
 */

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

export interface EmotionalTrend {
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
