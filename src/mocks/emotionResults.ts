
import { EmotionResult } from '@/types';

export const mockEmotionResults: EmotionResult[] = [
  {
    emotion: 'calm',
    confidence: 0.87,
    timestamp: new Date(),
    triggers: ['méditation', 'bonne nouvelle'],
    intensity: 7,
    secondary: ['happy', 'peaceful']
  },
  {
    emotion: 'stressed',
    confidence: 0.72,
    timestamp: new Date(Date.now() - 86400000), // 1 jour avant
    triggers: ['réunion', 'échéance'],
    intensity: 6,
    secondary: ['anxious', 'worried']
  },
  {
    emotion: 'happy',
    confidence: 0.91,
    timestamp: new Date(Date.now() - 172800000), // 2 jours avant
    triggers: ['réussite', 'événement social'],
    intensity: 8,
    secondary: ['excited', 'optimistic']
  }
];

export default mockEmotionResults;
