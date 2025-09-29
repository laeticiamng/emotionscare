
import { EmotionResult, Emotion } from '@/types/emotion';

// Normalise les résultats d'émotions pour assurer la compatibilité entre les différentes structures
export function normalizeEmotionResult(result: any): EmotionResult {
  const normalized: EmotionResult = {
    id: result.id || `emotion-${Date.now()}`,
    emotion: result.emotion || result.name || 'neutral',
    confidence: result.confidence || 0.5,
    intensity: result.intensity || 0.5,
    emojis: result.emojis || ['😐'],
    timestamp: result.timestamp || result.date || new Date().toISOString()
  };

  // Copier les champs supplémentaires s'ils sont présents
  if (result.source) normalized.source = result.source;
  if (result.text) normalized.text = result.text;
  if (result.transcript) normalized.transcript = result.transcript;
  if (result.audioUrl) normalized.audioUrl = result.audioUrl;
  if (result.audio_url) normalized.audio_url = result.audio_url;
  if (result.facialExpression) normalized.facialExpression = result.facialExpression;
  if (result.feedback) normalized.feedback = result.feedback;
  if (result.ai_feedback) normalized.ai_feedback = result.ai_feedback;
  if (result.score) normalized.score = result.score;
  if (result.userId) normalized.userId = result.userId;
  if (result.user_id) normalized.user_id = result.user_id;
  if (result.date) normalized.date = result.date;
  if (result.recommendations) normalized.recommendations = result.recommendations;
  if (result.textInput) normalized.textInput = result.textInput;

  return normalized;
}

// Convertit un objet Emotion en EmotionResult
export function emotionToEmotionResult(emotion: Emotion): EmotionResult {
  return {
    id: emotion.id || `emotion-${Date.now()}`,
    emotion: emotion.emotion || emotion.name || 'neutral',
    confidence: emotion.confidence || 0.5,
    intensity: emotion.intensity || 0.5,
    emojis: [emotion.emoji || '😐'],
    timestamp: emotion.date || new Date().toISOString(),
    source: emotion.source as any || 'manual',
    text: emotion.text,
    transcript: emotion.transcript,
    audioUrl: emotion.audioUrl,
    feedback: emotion.feedback,
    score: emotion.score,
    userId: emotion.userId || emotion.user_id,
  };
}

// Normalise l'intensité d'une émotion pour s'assurer qu'elle est un nombre entre 0 et 1
export function normalizeEmotionIntensity(intensity: any): number {
  if (typeof intensity === 'number') {
    return Math.max(0, Math.min(1, intensity));
  } else if (intensity === 'low') {
    return 0.25;
  } else if (intensity === 'medium') {
    return 0.5;
  } else if (intensity === 'high') {
    return 0.75;
  } else {
    return 0.5; // Valeur par défaut
  }
}

// Obtient un emoji correspondant à une émotion
export function getEmotionEmoji(emotion: string): string {
  const emotionMap: Record<string, string> = {
    happy: '😊',
    joy: '😄',
    sad: '😔',
    anger: '😠',
    fear: '😨',
    surprise: '😮',
    disgust: '🤢',
    neutral: '😐',
    calm: '😌',
    anxious: '😰',
    excited: '🤩',
    tired: '😴',
    stressed: '😩',
    content: '🙂',
    relaxed: '😌'
  };

  return emotionMap[emotion.toLowerCase()] || '😐';
}

// Obtient un tableau d'emojis pour une émotion si non définis
export function getEmotionEmojis(emotion: string): string[] {
  const mainEmoji = getEmotionEmoji(emotion);
  
  const emotionMap: Record<string, string[]> = {
    happy: [mainEmoji, '🙂', '😃'],
    joy: [mainEmoji, '😄', '😁'],
    sad: [mainEmoji, '😢', '😥'],
    anger: [mainEmoji, '😡', '🤬'],
    fear: [mainEmoji, '😱', '😨'],
    surprise: [mainEmoji, '😲', '😯'],
    disgust: [mainEmoji, '🤮', '😖'],
    neutral: [mainEmoji, '😶', '😑'],
    calm: [mainEmoji, '😌', '🧘'],
    anxious: [mainEmoji, '😰', '😥'],
    excited: [mainEmoji, '😃', '🥳'],
    tired: [mainEmoji, '😴', '🥱'],
    stressed: [mainEmoji, '😩', '😫'],
    content: [mainEmoji, '😊', '☺️'],
    relaxed: [mainEmoji, '😌', '🧘']
  };

  return emotionMap[emotion.toLowerCase()] || [mainEmoji];
}
