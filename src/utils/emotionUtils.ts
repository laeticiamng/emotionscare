import { EmotionResult } from '@/types/emotion';

// Type pour les émotions brutes (compatibilité legacy)
interface LegacyEmotion {
  id?: string;
  emotion?: string;
  name?: string;
  emoji?: string;
  confidence?: number;
  intensity?: number;
  date?: string;
  source?: string;
  text?: string;
  transcript?: string;
  audioUrl?: string;
  feedback?: string;
  score?: number;
  userId?: string;
  user_id?: string;
}

// Normalise les résultats d'émotions pour assurer la compatibilité entre les différentes structures
export function normalizeEmotionResult(result: any): EmotionResult {
  const normalized: EmotionResult = {
    emotion: result.emotion || result.name || 'neutral',
    confidence: result.confidence || 0.5,
    valence: result.valence || 0,
    arousal: result.arousal || 0,
    timestamp: result.timestamp ? new Date(result.timestamp) : new Date(),
    intensity: result.intensity || 0.5,
  };

  // Copier les champs supplémentaires s'ils sont présents
  if (result.source) normalized.source = result.source;
  if (result.transcription) normalized.transcription = result.transcription;
  if (result.sentiment) normalized.sentiment = result.sentiment;
  if (result.details) normalized.details = result.details;
  if (result.insight) normalized.insight = result.insight;
  if (result.suggestions) normalized.suggestions = result.suggestions;

  return normalized;
}

// Convertit un objet legacy Emotion en EmotionResult
export function emotionToEmotionResult(emotion: LegacyEmotion): EmotionResult {
  return {
    emotion: emotion.emotion || emotion.name || 'neutral',
    confidence: emotion.confidence || 0.5,
    valence: 0,
    arousal: emotion.intensity || 0.5,
    timestamp: emotion.date ? new Date(emotion.date) : new Date(),
    intensity: emotion.intensity || 0.5,
    source: (emotion.source as any) || 'manual',
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
