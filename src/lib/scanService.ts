
import { EmotionResult } from '@/types/emotion';

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
      source: 'text'
    },
    {
      id: '2',
      emotion: 'calm',
      score: 0.75,
      confidence: 0.8,
      text: "La séance de méditation était très apaisante",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      emojis: ['😌'],
      source: 'voice'
    },
    {
      id: '3',
      emotion: 'sadness',
      score: 0.6,
      confidence: 0.75,
      text: "Je me sens un peu triste aujourd'hui",
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      emojis: ['😢'],
      source: 'text'
    }
  ];
};

// Alias for consistent naming
export const fetchEmotionsHistory = fetchEmotionHistory;
