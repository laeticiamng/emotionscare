
import { EmotionResult } from '@/types/emotion';

// Analyze emotion from text input
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // This would typically call an API
  // For demonstration, we'll return mock data
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
  
  // Simple sentiment analysis mock
  const isPositive = text.toLowerCase().includes('happy') || 
                     text.toLowerCase().includes('good') ||
                     text.toLowerCase().includes('great') ||
                     text.toLowerCase().includes('excellent');
  
  const isNegative = text.toLowerCase().includes('sad') || 
                     text.toLowerCase().includes('bad') ||
                     text.toLowerCase().includes('awful') ||
                     text.toLowerCase().includes('terrible');
  
  let emotion = 'neutral';
  let score = 0.5;
  
  if (isPositive) {
    emotion = 'joy';
    score = 0.8;
  } else if (isNegative) {
    emotion = 'sadness';
    score = 0.3;
  }
  
  return {
    emotion,
    score,
    confidence: 0.75,
    emojis: [emotion === 'joy' ? '😊' : emotion === 'sadness' ? '😢' : '😐'],
    text,
    feedback: `Your message seems to express ${emotion}. Is that accurate?`,
    recommendations: [
      'Consider journaling about this feeling',
      'Try a meditation session',
      'Music can help regulate emotions'
    ]
  };
};

// Fetch emotion scan history for the current user
export const fetchEmotionHistory = async (): Promise<EmotionResult[]> => {
  // This would typically call an API
  // For demonstration, we'll return mock data
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
  
  return [
    {
      id: '1',
      emotion: 'joy',
      score: 0.85,
      confidence: 0.9,
      text: "J'ai eu une excellente journée aujourd'hui!",
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      emojis: ['😊'],
      source: 'text',
      feedback: "Wonderful! Joy is a powerful emotion that can enhance creativity."
    },
    {
      id: '2',
      emotion: 'calm',
      score: 0.75,
      confidence: 0.8,
      text: "La séance de méditation était très apaisante",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      emojis: ['😌'],
      source: 'voice',
      feedback: "Calm is vital for deep thought and reflection."
    },
    {
      id: '3',
      emotion: 'sadness',
      score: 0.6,
      confidence: 0.75,
      text: "Je me sens un peu triste aujourd'hui",
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      emojis: ['😢'],
      source: 'text',
      feedback: "Sadness helps us process difficult experiences and connect with others."
    }
  ];
};

// Alias for consistent naming
export const fetchEmotionsHistory = fetchEmotionHistory;
