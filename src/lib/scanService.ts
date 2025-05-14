
import { v4 as uuid } from 'uuid';
import { Emotion, EmotionResult } from '@/types';

// Mock data for emotions
const EMOTION_TYPES = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral', 'calm', 'anxious'];

// In-memory storage for emotions (in a real app, this would be a database)
let emotionsStore: Emotion[] = [];

/**
 * Analyze text and emoji input to determine emotional state
 */
export const analyzeEmotion = async (input: any): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, we'll generate a random emotion
  const emotion = EMOTION_TYPES[Math.floor(Math.random() * EMOTION_TYPES.length)];
  const score = Math.floor(Math.random() * 10) + 1;
  
  // Extract text if the input is an object
  const text = typeof input === 'string' ? input : input.text || '';
  const emojis = typeof input === 'string' ? '' : input.emojis || '';
  
  return {
    id: uuid(),
    user_id: typeof input === 'string' ? 'user-id' : input.user_id,
    emotion,
    primaryEmotion: emotion, // For backward compatibility
    score,
    text,
    emojis,
    transcript: typeof input === 'string' ? '' : input.text || '',
    confidence: Math.random() * 0.5 + 0.5,
    feedback: `Based on your input, I detect a ${emotion} emotion with an intensity of ${score}/10. This might be related to ${Math.random() > 0.5 ? 'recent events' : 'your current environment'}.`,
    ai_feedback: `Based on your input, I detect a ${emotion} emotion with an intensity of ${score}/10. This might be related to ${Math.random() > 0.5 ? 'recent events' : 'your current environment'}.`,
  };
};

/**
 * Analyze audio stream to determine emotional state
 */
export const analyzeAudioStream = async (audioBlob: Blob, userId: string): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, we'll generate a random emotion
  const emotion = EMOTION_TYPES[Math.floor(Math.random() * EMOTION_TYPES.length)];
  const score = Math.floor(Math.random() * 10) + 1;
  
  return {
    id: uuid(),
    user_id: userId,
    emotion,
    primaryEmotion: emotion, // For backward compatibility
    score,
    transcript: "This is a simulated transcript of what you said.",
    confidence: Math.random() * 0.5 + 0.5,
    feedback: `Based on your voice patterns, I detect ${emotion} with an intensity of ${score}/10.`,
    ai_feedback: `Based on your voice patterns, I detect ${emotion} with an intensity of ${score}/10.`,
  };
};

/**
 * Save emotion to storage
 */
export const saveEmotion = async (emotion: Emotion): Promise<Emotion> => {
  // Ensure the emotion has an ID
  if (!emotion.id) {
    emotion.id = uuid();
  }
  
  // Ensure the emotion has a date
  if (!emotion.date) {
    emotion.date = new Date().toISOString();
  }
  
  // Store the emotion
  emotionsStore.push(emotion);
  
  // Return the stored emotion
  return emotion;
};

/**
 * Get emotions for a specific user
 */
export const getUserEmotions = async (userId: string): Promise<Emotion[]> => {
  return emotionsStore.filter(emotion => emotion.user_id === userId);
};

/**
 * Get a specific emotion by ID
 */
export const getEmotionById = async (emotionId: string): Promise<Emotion | null> => {
  const emotion = emotionsStore.find(emotion => emotion.id === emotionId);
  return emotion || null;
};

/**
 * Delete an emotion by ID
 */
export const deleteEmotion = async (emotionId: string): Promise<boolean> => {
  const initialLength = emotionsStore.length;
  emotionsStore = emotionsStore.filter(emotion => emotion.id !== emotionId);
  return emotionsStore.length < initialLength;
};
