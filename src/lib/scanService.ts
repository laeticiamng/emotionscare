
import { Emotion, EmotionResult } from '@/types';

// Mock database
const emotionEntries: Record<string, Emotion[]> = {};

export const createEmotionEntry = async (data: {
  user_id: string;
  date: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<Emotion> => {
  // Create a new emotion entry
  const newEntry: Emotion = {
    id: `emotion-${Date.now()}`,
    user_id: data.user_id,
    date: data.date,
    text: data.text || '',
    emojis: data.emojis || '',
    sentiment: Math.random() * 10, // Mock sentiment score
    anxiety: Math.round(Math.random() * 10),
    energy: Math.round(Math.random() * 10),
    // Include optional fields if provided
    audio_url: data.audio_url,
    is_confidential: data.is_confidential,
    share_with_coach: data.share_with_coach
  };

  // Add to mock database
  if (!emotionEntries[data.user_id]) {
    emotionEntries[data.user_id] = [];
  }
  emotionEntries[data.user_id].push(newEntry);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return newEntry;
};

export const fetchLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  // Check if user has any emotions
  if (!emotionEntries[userId] || emotionEntries[userId].length === 0) {
    return null;
  }

  // Return latest emotion
  const entries = emotionEntries[userId];
  return entries[entries.length - 1];
};

export const fetchEmotions = async (userId: string): Promise<Emotion[]> => {
  // Return all emotions for a user
  return emotionEntries[userId] || [];
};

// New function to analyze an audio stream
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock emotion detection result
  const emotions = ['calm', 'happy', 'stressed', 'anxious', 'focused', 'sad', 'excited'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    id: `analysis-${Date.now()}`,
    emotion: randomEmotion,
    confidence: Math.random() * 0.4 + 0.6, // Random confidence between 0.6 and 1.0
    intensity: Math.random() * 0.8 + 0.2, // Random intensity between 0.2 and 1.0
    primaryEmotion: {
      name: randomEmotion,
      score: Math.round(Math.random() * 100)
    },
    secondaryEmotions: [
      emotions[Math.floor(Math.random() * emotions.length)], 
      emotions[Math.floor(Math.random() * emotions.length)]
    ],
    transcript: "Ceci est une transcription simulée de l'audio analysé. Le système génèrerait normalement ici le texte reconnu à partir de l'enregistrement vocal.",
    feedback: `Votre voix révèle des niveaux de ${randomEmotion} qui pourraient indiquer ${randomEmotion === 'stressed' || randomEmotion === 'anxious' ? 'un besoin de prendre du recul' : 'une bonne gestion émotionnelle'}.`,
    score: Math.round(Math.random() * 10)
  };
};

// Function to analyze emotion based on text, emojis, or audio
export const analyzeEmotion = async (data: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Mock emotion detection
  const emotions = ['calm', 'happy', 'stressed', 'anxious', 'focused', 'sad', 'excited'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    id: `analysis-${Date.now()}`,
    user_id: data.user_id,
    emotion: randomEmotion,
    confidence: Math.random() * 0.4 + 0.6,
    intensity: Math.random() * 0.8 + 0.2,
    primaryEmotion: {
      name: randomEmotion,
      score: Math.round(Math.random() * 100)
    },
    text: data.text,
    emojis: data.emojis,
    feedback: `Notre analyse indique que vous vous sentez plutôt ${randomEmotion}. ${randomEmotion === 'stressed' || randomEmotion === 'anxious' ? 'Pensez à faire une pause et à pratiquer quelques exercices de respiration.' : 'Continuez ainsi, votre équilibre émotionnel semble bon.'}`,
    score: Math.round(Math.random() * 10)
  };
};

// Function to save an emotion
export const saveEmotion = async (data: {
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
}): Promise<Emotion> => {
  const newEmotion: Emotion = {
    id: `emotion-${Date.now()}`,
    user_id: data.user_id,
    date: data.date,
    emotion: data.emotion,
    name: data.emotion,
    score: data.score,
    sentiment: data.score,
    anxiety: Math.round(Math.random() * 10),
    energy: Math.round(Math.random() * 10),
    text: data.text,
    emojis: data.emojis,
    audio_url: data.audio_url,
    ai_feedback: data.ai_feedback,
    category: 'mood'
  };
  
  // Add to mock database
  if (!emotionEntries[data.user_id]) {
    emotionEntries[data.user_id] = [];
  }
  emotionEntries[data.user_id].push(newEmotion);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return newEmotion;
};
