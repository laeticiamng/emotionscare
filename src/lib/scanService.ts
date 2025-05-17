
import { EmotionResult } from '@/types/scan';
import { Emotion } from '@/types/emotions';

// Fonction simulée pour récupérer l'historique des émotions d'un utilisateur
export async function fetchEmotionHistory(userId: string): Promise<Emotion[]> {
  console.log(`Fetching emotion history for user: ${userId}`);
  
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retourner des données simulées
  return [
    {
      id: 'emo-1',
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      emotion: 'joy', 
      score: 0.85
    },
    {
      id: 'emo-2',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      emotion: 'calm',
      score: 0.72
    },
    {
      id: 'emo-3',
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      emotion: 'anxious',
      score: 0.45
    },
    {
      id: 'emo-4',
      date: new Date(Date.now() - 86400000 * 1).toISOString(),
      emotion: 'joy',
      score: 0.92
    }
  ];
}

// Fonction simulée pour créer une nouvelle émotion
export async function createEmotion(data: Partial<EmotionResult>): Promise<EmotionResult> {
  console.log('Creating emotion record:', data);
  
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Créer un nouvel enregistrement d'émotion
  const newEmotion: EmotionResult = {
    id: `emo-${Date.now()}`,
    userId: data.userId || 'default-user',
    timestamp: new Date().toISOString(),
    primaryEmotion: data.primaryEmotion || data.emotion || 'neutral',
    score: data.score || Math.random(),
    emotions: data.emotions || { neutral: 0.5 },
    ...data
  };
  
  return newEmotion;
}

// Fonction simulée pour récupérer la dernière émotion d'un utilisateur
export async function getLatestEmotion(userId: string): Promise<EmotionResult | null> {
  console.log(`Fetching latest emotion for user: ${userId}`);
  
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Retourner un enregistrement simulé
  return {
    id: `emo-latest-${userId}`,
    userId,
    timestamp: new Date().toISOString(),
    primaryEmotion: 'joy',
    score: 0.87,
    emotions: {
      joy: 0.87,
      calm: 0.65,
      anxious: 0.12
    }
  };
}

// Fonction simulée pour analyser les émotions à partir de plusieurs sources
export async function analyzeEmotion(data: {
  text?: string;
  emojis?: string;
  audio_url?: string;
}): Promise<EmotionResult> {
  console.log('Analyzing emotion from inputs:', data);
  
  // Simuler un délai d'analyse
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Déterminer l'émotion dominante (simulée)
  let primaryEmotion = 'neutral';
  let score = 0.5;
  
  if (data.text?.toLowerCase().includes('heureux') || data.text?.toLowerCase().includes('content') || 
      data.emojis?.includes('😊') || data.emojis?.includes('😃')) {
    primaryEmotion = 'joy';
    score = 0.85;
  } else if (data.text?.toLowerCase().includes('triste') || data.text?.toLowerCase().includes('déprimé') || 
      data.emojis?.includes('😢') || data.emojis?.includes('😭')) {
    primaryEmotion = 'sadness';
    score = 0.75;
  } else if (data.text?.toLowerCase().includes('calme') || data.text?.toLowerCase().includes('serein') || 
      data.emojis?.includes('😌') || data.emojis?.includes('🧘')) {
    primaryEmotion = 'calm';
    score = 0.8;
  } else if (data.text?.toLowerCase().includes('anxieux') || data.text?.toLowerCase().includes('stress') || 
      data.emojis?.includes('😰') || data.emojis?.includes('😓')) {
    primaryEmotion = 'anxious';
    score = 0.7;
  }
  
  return {
    id: `emo-analyze-${Date.now()}`,
    userId: 'current-user',
    timestamp: new Date().toISOString(),
    primaryEmotion,
    score,
    emotions: {
      [primaryEmotion]: score,
      neutral: 1 - score
    },
    text: data.text,
    transcript: data.text,
    audioUrl: data.audio_url
  };
}

export async function fetchEmotionById(emotionId: string): Promise<EmotionResult | null> {
  console.log(`Fetching emotion with ID: ${emotionId}`);
  
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Retourner un enregistrement simulé
  return {
    id: emotionId,
    userId: 'user-1',
    timestamp: new Date().toISOString(),
    primaryEmotion: 'joy',
    score: 0.87,
    emotions: {
      joy: 0.87,
      calm: 0.65,
      anxious: 0.12
    }
  };
}
