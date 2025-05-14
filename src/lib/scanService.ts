
import { Emotion, EmotionResult } from '@/types';

// Mock implementation to handle type errors in EmotionScanLive and useEmotionScanFormState
export async function analyzeEmotion(data: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential: boolean;
  share_with_coach: boolean;
}): Promise<EmotionResult> {
  // Mock implementation
  return {
    id: crypto.randomUUID(),
    emotion: data.emojis?.includes('😊') ? 'joy' : 
             data.emojis?.includes('😢') ? 'sadness' :
             data.emojis?.includes('😡') ? 'anger' :
             data.text?.includes('heureux') ? 'joy' : 'neutral',
    score: Math.floor(Math.random() * 10) + 1,
    confidence: Math.random(),
    text: data.text,
    transcript: data.text,
    emojis: data.emojis,
    feedback: `Analyse basée sur ${data.text || data.emojis || 'votre entrée'}`,
    ai_feedback: `Conseils basés sur votre état émotionnel actuel.`,
    recommendations: ['Prendre une pause', 'Exercice de respiration', 'Écouter de la musique'],
  };
}

export async function analyzeAudioStream(audioBlob: Blob): Promise<EmotionResult> {
  // Mock implementation
  return {
    id: crypto.randomUUID(),
    emotion: 'calm',
    score: 7,
    confidence: 0.85,
    transcript: "J'ai passé une journée plutôt agréable aujourd'hui.",
    feedback: "Vous semblez calme et détendu. Continuez ainsi.",
    ai_feedback: "Votre niveau de stress semble bas, c'est très positif.",
    recommendations: ['Continuez votre routine positive', 'Notez vos succès de la journée'],
  };
}

export async function createEmotionEntry(data: {
  user_id: string;
  date: string;
  emotion?: string;
  score?: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
}): Promise<Emotion> {
  // Mock implementation
  return {
    id: crypto.randomUUID(),
    user_id: data.user_id,
    date: data.date,
    emotion: data.emotion || 'neutral',
    score: data.score || 5,
    intensity: data.score || 5,
    text: data.text,
    emojis: data.emojis,
    ai_feedback: data.ai_feedback
  };
}

export async function fetchLatestEmotion(userId: string): Promise<Emotion | null> {
  // Mock implementation
  return {
    id: crypto.randomUUID(),
    user_id: userId,
    date: new Date().toISOString(),
    emotion: 'joy',
    score: 8,
    intensity: 8,
    text: "Je me sens vraiment bien aujourd'hui!",
    emojis: '😊'
  };
}

export async function fetchEmotionHistory(userId: string): Promise<Emotion[]> {
  // Mock implementation
  return [
    {
      id: crypto.randomUUID(),
      user_id: userId,
      date: new Date().toISOString(),
      emotion: 'joy',
      score: 8,
      intensity: 8
    },
    {
      id: crypto.randomUUID(),
      user_id: userId,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      emotion: 'sadness',
      score: 3,
      intensity: 3
    }
  ];
}

export async function saveEmotion(data: Partial<Emotion>): Promise<void> {
  // Mock implementation
  console.log("Emotion saved:", data);
}
