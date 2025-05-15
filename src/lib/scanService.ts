
import { EmotionResult } from '@/types';

export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // This is a mock implementation - in a real application, this would call an API
  console.log('Analyzing emotion for text:', text);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock result
  return {
    emotion: 'calm',
    confidence: 0.85,
    feedback: 'You seem to be in a calm and balanced state of mind.',
    recommendations: [
      'Consider maintaining this state with some mindfulness exercises',
      'Take a moment to appreciate your current emotional balance',
      'This would be a good time for creative activities'
    ],
    timestamp: new Date().toISOString()
  };
};

export const fetchEmotionsHistory = async (userId: string, period?: string): Promise<EmotionResult[]> => {
  // Mock implementation
  console.log(`Fetching emotion history for user ${userId} for period ${period}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock history data
  const emotions = ['joy', 'calm', 'sadness', 'anxiety', 'excitement'];
  const history: EmotionResult[] = [];
  
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    history.push({
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      confidence: 0.7 + Math.random() * 0.3,
      timestamp: date.toISOString(),
      score: Math.floor(Math.random() * 100)
    });
  }
  
  return history;
};
