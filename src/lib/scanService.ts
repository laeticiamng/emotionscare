
import { Emotion, EmotionResult } from '@/types';

/**
 * Analyze emotion from text, emojis, or audio
 * @param data Data containing content to analyze
 * @returns Promise with the emotion analysis result
 */
export const analyzeEmotion = async (data: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> => {
  console.log('Analyzing emotion with data:', data);
  
  // Mock response for development
  return {
    id: crypto.randomUUID(),
    user_id: data.user_id,
    emotion: data.emojis?.includes('😃') ? 'happy' : data.emojis?.includes('😢') ? 'sad' : 'neutral',
    score: Math.floor(Math.random() * 100),
    confidence: 0.85,
    text: data.text || '',
    transcript: data.text || '',
    feedback: "Votre émotion a été analysée avec succès.",
    recommendations: [
      "Prenez quelques minutes pour noter ce qui a influencé votre humeur aujourd'hui",
      "Essayez une séance de musicothérapie adaptée à votre état émotionnel"
    ],
    timestamp: new Date().toISOString(),
    source: data.audio_url ? 'voice' : data.emojis ? 'emoji' : 'text'
  };
};

/**
 * Analyze audio stream for emotional content
 * @param audioBlob Audio recording blob
 * @returns Promise with the audio analysis result
 */
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  console.log('Analyzing audio stream, blob size:', audioBlob.size);
  
  // Mock response for development
  return {
    id: crypto.randomUUID(),
    emotion: 'calm',
    dominantEmotion: 'calm',
    score: 75,
    confidence: 0.82,
    text: "Je me sens plutôt calme aujourd'hui.",
    transcript: "Je me sens plutôt calme aujourd'hui et j'apprécie ce moment de tranquillité.",
    feedback: "Vous semblez être dans un état de calme. C'est un bon moment pour la réflexion.",
    recommendations: [
      "Profitez de ce calme pour faire une séance de méditation",
      "Écrivez vos pensées dans votre journal"
    ],
    timestamp: new Date().toISOString(),
    source: 'voice'
  };
};

/**
 * Create a new emotion entry
 * @param data Emotion data to save
 * @returns Promise with the created emotion
 */
export const createEmotionEntry = async (data: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
}): Promise<Emotion> => {
  console.log('Creating emotion entry:', data);
  
  // Mock response
  return {
    id: crypto.randomUUID(),
    user_id: data.user_id,
    date: new Date().toISOString(),
    emotion: 'happy',
    score: 85,
    confidence: 0.9,
    text: data.text,
    emojis: data.emojis,
    audio_url: data.audio_url,
    ai_feedback: "Vous semblez être dans un état positif aujourd'hui!",
    source: data.audio_url ? 'voice' : data.emojis ? 'emoji' : 'text'
  };
};

/**
 * Fetch the latest emotion for a user
 * @param userId User ID
 * @returns Promise with the latest emotion
 */
export const fetchLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  console.log('Fetching latest emotion for user:', userId);
  
  // Mock response
  return {
    id: crypto.randomUUID(),
    user_id: userId,
    date: new Date().toISOString(),
    emotion: 'focused',
    score: 70,
    confidence: 0.75,
    text: "Je me concentre sur mes tâches aujourd'hui",
    ai_feedback: "Votre niveau de concentration est bon. Continuez ainsi!",
    source: 'text'
  };
};

/**
 * Fetch emotion history for a user
 * @param userId User ID
 * @param days Number of days to look back (default: 7)
 * @returns Promise with array of emotions
 */
export const fetchEmotionHistory = async (userId: string, days: number = 7): Promise<Emotion[]> => {
  console.log(`Fetching emotion history for user ${userId} for the last ${days} days`);
  
  // Generate mock data
  const emotions: Emotion[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    emotions.push({
      id: crypto.randomUUID(),
      user_id: userId,
      date: date.toISOString(),
      emotion: ['happy', 'calm', 'focused', 'excited', 'tired', 'anxious'][Math.floor(Math.random() * 6)],
      score: Math.floor(Math.random() * 100),
      confidence: Math.random() * 0.5 + 0.5,
      text: "Entrée du journal",
      ai_feedback: "Feedback de l'IA",
      source: ['text', 'voice', 'emoji'][Math.floor(Math.random() * 3)]
    });
  }
  
  return emotions;
};
