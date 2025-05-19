
import { EmotionResult } from '@/types/emotion';

/**
 * Normalizes an emotion result to handle different structure variations
 * that may come from different APIs or components
 */
export function normalizeEmotionResult(result: EmotionResult): EmotionResult {
  if (!result) return {} as EmotionResult;
  
  // Default values
  const normalized: EmotionResult = {
    emotion: result.emotion || '',
    score: result.score || 0,
    confidence: result.confidence || 0,
  };
  
  // Handle timestamps in different formats
  if (result.timestamp) {
    normalized.timestamp = result.timestamp;
  } else if (result.date) {
    normalized.timestamp = result.date;
  }
  
  // Handle text content
  if (result.text) {
    normalized.text = result.text;
  } else if (result.textInput) {
    normalized.text = result.textInput;
  }
  
  // Handle feedback
  if (result.feedback) {
    normalized.feedback = result.feedback;
  } else if (result.ai_feedback) {
    normalized.feedback = result.ai_feedback;
  }
  
  // Handle user identification
  if (result.userId) {
    normalized.userId = result.userId;
  } else if (result.user_id) {
    normalized.userId = result.user_id;
  }
  
  // Copy other properties
  if (result.intensity !== undefined) normalized.intensity = result.intensity;
  if (result.source) normalized.source = result.source;
  if (result.id) normalized.id = result.id;
  if (result.emojis) normalized.emojis = result.emojis;
  if (result.recommendations) normalized.recommendations = result.recommendations;
  if (result.audioUrl) normalized.audioUrl = result.audioUrl;
  if (result.transcript) normalized.transcript = result.transcript;
  
  return normalized;
}

/**
 * Calculates a numeric intensity based on confidence and score
 */
export function calculateIntensity(result: EmotionResult): number {
  if (!result) return 0;
  
  // If intensity is already provided, use that
  if (result.intensity !== undefined) {
    return result.intensity;
  }
  
  // Calculate based on confidence and/or score
  if (result.confidence !== undefined && result.score !== undefined) {
    return (result.confidence + result.score / 100) / 2;
  }
  
  if (result.confidence !== undefined) {
    return result.confidence;
  }
  
  if (result.score !== undefined) {
    return result.score / 100;
  }
  
  return 0.5; // Default middle value
}
