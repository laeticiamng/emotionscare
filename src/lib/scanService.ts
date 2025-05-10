
import { v4 as uuidv4 } from 'uuid';
import { Emotion, EmotionResult } from '@/types';

// Simple emotion colors lookup
const EMOTION_COLORS: Record<string, string> = {
  joy: '#FFD700',
  happy: '#FFD700',
  sad: '#4169E1',
  angry: '#FF4500',
  fear: '#8A2BE2',
  disgust: '#32CD32',
  surprise: '#FF69B4',
  neutral: '#808080',
  calm: '#87CEFA',
  stressed: '#FF6347',
  anxious: '#9370DB',
  tired: '#B0C4DE',
};

// Mock database of emotions
const emotionHistory: Emotion[] = [];

// Analyze text for emotion detection
export async function analyzeTextEmotion(text: string): Promise<EmotionResult> {
  // In real implementation, this would call an AI service
  // For now, we'll do simple keyword detection

  const emotions = {
    happy: ['happy', 'joy', 'great', 'excellent', 'good', 'wonderful'],
    sad: ['sad', 'unhappy', 'depressed', 'down', 'blue', 'miserable'],
    angry: ['angry', 'mad', 'furious', 'upset', 'annoyed', 'irritated'],
    anxious: ['anxious', 'worried', 'nervous', 'tense', 'afraid', 'fearful'],
    calm: ['calm', 'relaxed', 'peaceful', 'serene', 'tranquil', 'content'],
    stressed: ['stress', 'stressed', 'overwhelmed', 'busy', 'pressure', 'tension']
  };

  let detectedEmotion = 'neutral';
  let maxCount = 0;

  // Simple algorithm: count occurrences of emotion keywords
  Object.entries(emotions).forEach(([emotion, keywords]) => {
    const lowerText = text.toLowerCase();
    let count = 0;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) count += matches.length;
    });
    
    if (count > maxCount) {
      maxCount = count;
      detectedEmotion = emotion;
    }
  });
  
  const confidence = maxCount > 0 ? Math.min(0.5 + (maxCount * 0.1), 0.95) : 0.5;
  
  return {
    id: uuidv4(),
    emotion: detectedEmotion,
    confidence,
    score: confidence * 0.8,
    emojis: getEmotionEmoji(detectedEmotion),
    text,
    primaryEmotion: {
      name: detectedEmotion, 
      score: confidence
    },
    intensity: confidence * 0.7
  };
}

// Track a new emotion
export async function trackEmotion(emotion: Partial<Emotion>): Promise<Emotion> {
  const now = new Date();
  
  const newEmotion: Emotion = {
    id: uuidv4(),
    user_id: emotion.user_id || 'anonymous',
    date: now,
    emotion: emotion.emotion || 'neutral',
    dominant_emotion: emotion.dominant_emotion || emotion.emotion || 'neutral',
    confidence: emotion.confidence || 0.5,
    score: emotion.score || 0.5,
    emojis: emotion.emojis || getEmotionEmoji(emotion.emotion || 'neutral'),
    text: emotion.text || '',
    ...emotion
  };
  
  emotionHistory.push(newEmotion);
  return newEmotion;
}

// Get emotion history for a user
export async function getEmotionHistory(userId: string, limit: number = 10): Promise<Emotion[]> {
  return emotionHistory
    .filter(e => e.user_id === userId)
    .sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit);
}

// Helper function to get emojis for emotions
function getEmotionEmoji(emotion: string): string {
  const emojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fear: '😨',
    disgust: '🤢',
    surprise: '😲',
    neutral: '😐',
    calm: '😌',
    stressed: '😫',
    anxious: '😰',
    tired: '😴'
  };
  
  return emojis[emotion] || '😐';
}

// Export service methods
export default {
  analyzeTextEmotion,
  trackEmotion,
  getEmotionHistory,
  getEmotionEmoji
};
