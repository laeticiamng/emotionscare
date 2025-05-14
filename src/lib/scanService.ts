
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types';

// Mock data for demonstration purposes
const mockEmotionHistory: EmotionResult[] = [
  {
    id: '1',
    user_id: 'user-1',
    date: new Date('2023-01-15').toISOString(),
    emotion: 'joy',
    score: 85,
    confidence: 0.85,
    intensity: 85,
    text: "I'm feeling really great today!",
    ai_feedback: 'Your joy is contagious. Keep up the positive mindset!'
  },
  {
    id: '2',
    user_id: 'user-1',
    date: new Date('2023-01-17').toISOString(),
    emotion: 'calm',
    score: 65,
    confidence: 0.75,
    intensity: 65,
    text: "Today was peaceful.",
    ai_feedback: 'Your calmness is a strength. Consider sharing this energy with others.'
  }
];

// Analyze emotion from text
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // In a real app, this would call an AI service API
  // For now, we'll use a simple mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      const emotions = ['happy', 'sad', 'angry', 'calm', 'anxious', 'excited'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.5 + Math.random() * 0.4; // 0.5 to 0.9
      const score = Math.round(confidence * 100);
      
      resolve({
        id: uuid(),
        user_id: 'current-user',
        date: new Date().toISOString(),
        emotion: randomEmotion,
        score: score,
        confidence: confidence,
        intensity: score,
        text: text,
        ai_feedback: `I detect that you're feeling ${randomEmotion}.`
      });
    }, 500);
  });
};

// Save emotion data to the database
export const saveEmotion = async (emotion: EmotionResult): Promise<EmotionResult> => {
  // In a real app, this would save to a database
  // For now, just simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const savedEmotion = {
        ...emotion,
        id: emotion.id || uuid(),
        date: emotion.date || new Date().toISOString(),
      };
      
      // Add to mock history (in a real app, this would be a database operation)
      mockEmotionHistory.push(savedEmotion);
      
      resolve(savedEmotion);
    }, 300);
  });
};

// Fetch emotion history for a user
export const fetchEmotionHistory = async (userId: string, limit: number = 10): Promise<EmotionResult[]> => {
  // In a real app, this would query a database
  return new Promise((resolve) => {
    setTimeout(() => {
      const userHistory = mockEmotionHistory
        .filter(e => e.user_id === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
        
      resolve(userHistory);
    }, 300);
  });
};

export default {
  analyzeEmotion,
  saveEmotion,
  fetchEmotionHistory
};
