
import { EmotionResult } from '@/types/emotion';

/**
 * Normalizes emotion data from different sources into a consistent EmotionResult format
 * @param data The emotion data to normalize
 * @returns Normalized EmotionResult object
 */
export function normalizeEmotionResult(data: any): EmotionResult {
  // Handle undefined or null data
  if (!data) {
    return {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      emotion: 'neutral',
      confidence: 0.5,
      intensity: 0.5,
      emojis: ['😐'],
      source: 'system',
    };
  }

  // Create a base object with required fields
  const result: EmotionResult = {
    id: data.id || crypto.randomUUID(),
    date: data.date || data.timestamp || new Date().toISOString(),
    emotion: data.emotion || 'neutral',
    confidence: data.confidence || 0.5,
    intensity: data.intensity || 0.5,
    emojis: data.emojis || ['😐'],
    source: data.source || 'system',
  };

  // Handle optional fields
  if (data.text) result.text = data.text;
  if (data.textInput) result.text = data.textInput;
  if (data.audio_url) result.audio_url = data.audio_url;
  if (data.audioUrl) result.audio_url = data.audioUrl;
  if (data.transcript) result.transcript = data.transcript;
  if (data.facialExpression) result.facialExpression = data.facialExpression;
  if (data.recommendations) result.recommendations = data.recommendations;
  if (data.emotions) {
    // Handle the case where emotions is an array of emotion objects
    if (Array.isArray(data.emotions) && data.emotions.length > 0) {
      result.emotion = data.emotions[0].name || result.emotion;
    }
  }

  return result;
}

/**
 * Converts legacy emotion data formats to the current EmotionResult format
 */
export function convertLegacyEmotionData(legacyData: any): EmotionResult {
  return normalizeEmotionResult(legacyData);
}

/**
 * Gets appropriate emoji for an emotion
 */
export function getEmotionEmoji(emotion: string): string {
  const emotionEmojiMap: Record<string, string> = {
    'happy': '😊',
    'sad': '😢',
    'angry': '😠',
    'fear': '😨',
    'surprise': '😲',
    'disgust': '🤢',
    'neutral': '😐',
    'joy': '😄',
    'calm': '😌',
    'anxious': '😰',
    'excited': '😃',
    'tired': '😴',
    'stressed': '😫',
    'relaxed': '😌',
  };
  
  return emotionEmojiMap[emotion.toLowerCase()] || '😐';
}
