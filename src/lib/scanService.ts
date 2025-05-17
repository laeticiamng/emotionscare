
import { EmotionResult } from '@/types/emotion';

// Mock scan service implementation
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Create a mock emotion result
  const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  const result: EmotionResult = {
    id: `scan-${Date.now()}`,
    emotion: randomEmotion,
    score: Math.floor(Math.random() * 100),
    confidence: Math.random() * 0.5 + 0.5,
    date: new Date().toISOString(),
    emojis: getEmojisForEmotion(randomEmotion),
    feedback: `Your text indicates ${randomEmotion}. This is a simulated analysis.`,
    recommendations: [
      'Take a few deep breaths',
      'Consider a short meditation session',
      'Listen to music that matches your mood'
    ]
  };

  return result;
};

export const saveEmotion = async (emotion: EmotionResult): Promise<EmotionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would save to a database
  console.log('Saving emotion:', emotion);
  
  // Return the same emotion with a confirmation
  return {
    ...emotion,
    id: emotion.id || `emotion-${Date.now()}`
  };
};

// Helper function to get emojis for each emotion
const getEmojisForEmotion = (emotion: string): string[] => {
  const emojiMap: Record<string, string[]> = {
    joy: ['😊', '😄', '🥰'],
    sadness: ['😢', '😥', '😞'],
    anger: ['😡', '😠', '🤬'],
    fear: ['😨', '😰', '😱'],
    surprise: ['😮', '😲', '🤯'],
    disgust: ['🤢', '😖', '🙄'],
    neutral: ['😐', '😑', '😶']
  };
  
  return emojiMap[emotion] || ['😶'];
};
