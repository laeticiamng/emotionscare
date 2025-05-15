
import { v4 as uuid } from 'uuid';
import { EmotionResult, Emotion } from '@/types';

// Mock data for emotion history
const mockEmotions: EmotionResult[] = [
  {
    id: uuid(),
    emotion: 'joy',
    score: 78,
    confidence: 0.78,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString(),
    text: "I'm feeling really good today!",
    feedback: "You seem to be in a positive state of mind. Keep up the good energy!"
  },
  {
    id: uuid(),
    emotion: 'calm',
    score: 65,
    confidence: 0.65,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    date: new Date(Date.now() - 86400000).toISOString(),
    text: "Just meditated and feeling relaxed.",
    feedback: "Your meditation practice is paying off. Your tranquility is evident."
  }
];

// Analyze text for emotion
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // Mock emotion analysis based on text
  const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm', 'anticipation', 'trust'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomScore = Math.floor(Math.random() * 60) + 40; // Score between 40-100
  
  return {
    id: uuid(),
    emotion: randomEmotion,
    score: randomScore,
    confidence: randomScore / 100,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString(),
    text: text,
    feedback: `Based on your text, you seem to be experiencing ${randomEmotion}.`,
    recommendations: [
      "Take a short break",
      "Practice deep breathing",
      "Listen to calming music"
    ],
    triggers: [
      "Work pressure",
      "Social interactions"
    ]
  };
};

// Save emotion to storage (mock implementation)
export const saveEmotion = async (emotion: EmotionResult): Promise<EmotionResult> => {
  // In a real app, this would save to a database
  console.log("Saving emotion:", emotion);
  
  const savedEmotion = {
    ...emotion,
    id: emotion.id || uuid(),
    timestamp: emotion.timestamp || new Date().toISOString(),
    date: emotion.date || new Date().toISOString()
  };
  
  mockEmotions.unshift(savedEmotion);
  return savedEmotion;
};

// Fetch emotion history (mock implementation)
export const fetchEmotionsHistory = async (userId: string, limit = 10): Promise<EmotionResult[]> => {
  // In a real app, this would fetch from a database
  return mockEmotions.slice(0, limit);
};

// Fetch latest emotion (mock implementation)
export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  // In a real app, this would fetch from a database
  return mockEmotions[0] || null;
};

// Create emotion entry
export const createEmotionEntry = async (data: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  date: string;
}): Promise<EmotionResult> => {
  // Mock emotion creation based on text
  const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm', 'anticipation', 'trust'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomScore = Math.floor(Math.random() * 60) + 40; // Score between 40-100

  const result: EmotionResult = {
    id: uuid(),
    emotion: randomEmotion,
    score: randomScore,
    confidence: randomScore / 100,
    timestamp: new Date().toISOString(),
    date: data.date,
    text: data.text,
    user_id: data.user_id,
    emojis: data.emojis,
    feedback: `Based on your input, you appear to be ${randomEmotion}.`,
    recommendations: [
      "Take a short break",
      "Practice deep breathing",
      "Try a quick meditation"
    ],
    triggers: [
      "Work pressure",
      "Social interactions"
    ],
    intensity: randomScore
  };
  
  await saveEmotion(result);
  return result;
};

export default {
  analyzeEmotion,
  saveEmotion,
  fetchEmotionsHistory,
  fetchLatestEmotion,
  createEmotionEntry
};
