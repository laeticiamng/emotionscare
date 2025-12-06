
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';
import { v4 as uuid } from 'uuid';

/**
 * Normalizes emotion result data to ensure compatibility with all components
 */
export function normalizeEmotionResult(data: Partial<EmotionResult>): EmotionResult {
  return {
    id: data.id || uuid(),
    emotion: data.emotion || 'neutral',
    confidence: data.confidence || 0.5,
    intensity: data.intensity || 0.5,
    timestamp: data.timestamp || new Date().toISOString(),
    source: data.source || 'manual',
    emojis: data.emojis || [],
    text: data.text || '',
    emotions: data.emotions || {},
    
    // Add compatibility fields with fallbacks
    primaryEmotion: data.primaryEmotion || data.emotion || 'neutral',
    score: data.score || data.confidence || 0.5,
    date: data.date || data.timestamp || new Date().toISOString(),
    feedback: data.feedback || data.ai_feedback || '',
    ai_feedback: data.ai_feedback || data.feedback || '',
    user_id: data.user_id || data.userId || '',
    userId: data.userId || data.user_id || '',
    audioUrl: data.audioUrl || data.audio_url || '',
    audio_url: data.audio_url || data.audioUrl || '',
    textInput: data.textInput || data.text || '',
    recommendations: data.recommendations || [],
    transcript: data.transcript || '',
    facialExpression: data.facialExpression || ''
  };
}

/**
 * Normalizes emotion recommendation data
 */
export function normalizeEmotionRecommendation(data: Partial<EmotionRecommendation>): EmotionRecommendation {
  return {
    id: data.id || uuid(),
    type: data.type || 'general',
    title: data.title || '',
    description: data.description || '',
    content: data.content || data.description || '',
    category: data.category || 'general',
    emotion: data.emotion || 'neutral',
    actionLink: data.actionLink || '',
    actionText: data.actionText || ''
  };
}

/**
 * Convert string recommendations to EmotionRecommendation objects
 */
export function convertStringRecommendations(recommendations: string[]): EmotionRecommendation[] {
  return recommendations.map(rec => ({
    id: uuid(),
    content: rec,
    type: 'general',
    category: 'general',
    description: rec,
    title: '',
    emotion: 'neutral',
    actionLink: '',
    actionText: ''
  }));
}
