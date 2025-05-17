
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types/emotion';

// Mock function for analyzing emotion from text
export async function analyzeEmotion(text: string): Promise<EmotionResult> {
  console.log('Analyzing emotion from text:', text);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Random emotion generator for mock implementation
  const emotions = ['joy', 'sadness', 'anger', 'fear', 'disgust', 'surprise', 'neutral'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomScore = Math.floor(Math.random() * 100);
  const randomConfidence = (Math.random() * 0.5) + 0.5; // 0.5 to 1.0
  
  return {
    id: uuid(),
    emotion: randomEmotion,
    score: randomScore,
    confidence: randomConfidence,
    date: new Date().toISOString(),
    text: text,
    feedback: `Il semble que vous ressentiez de ${randomEmotion} à un niveau ${randomScore > 70 ? 'élevé' : randomScore > 40 ? 'modéré' : 'bas'}.`,
    recommendations: [
      'Prenez quelques minutes pour respirer profondément',
      'Notez vos pensées dans un journal',
      'Parlez à un ami de confiance'
    ]
  };
}

// Function to save an emotion entry
export async function saveEmotion(emotion: Partial<EmotionResult>): Promise<EmotionResult> {
  console.log('Saving emotion:', emotion);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Complete any missing fields
  const completeEmotion: EmotionResult = {
    id: emotion.id || uuid(),
    emotion: emotion.emotion || 'neutral',
    score: emotion.score || Math.floor(Math.random() * 100),
    confidence: emotion.confidence || 0.7,
    date: emotion.date || new Date().toISOString(),
    user_id: emotion.user_id || 'current-user',
    text: emotion.text || '',
    feedback: emotion.feedback || ''
  };
  
  return completeEmotion;
}

// Function to fetch the latest emotion entry
export async function fetchLatestEmotion(userId: string): Promise<EmotionResult | null> {
  console.log('Fetching latest emotion for user:', userId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate a mock latest emotion
  return {
    id: uuid(),
    emotion: 'calm',
    score: 85,
    confidence: 0.9,
    date: new Date().toISOString(),
    user_id: userId,
    text: "Today I'm feeling relaxed after finishing my tasks.",
    feedback: "Il semble que vous vous sentiez calme et satisfait(e)."
  };
}

// Function to create a new emotion entry
export async function createEmotionEntry(data: Partial<EmotionResult>): Promise<EmotionResult> {
  return saveEmotion(data);
}
