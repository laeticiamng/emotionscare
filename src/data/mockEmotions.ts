// @ts-nocheck - Mock data file with flexible typing
import { EmotionResult } from '@/types/emotion';

// Mock emotion results for development and testing
export const mockEmotionResults: EmotionResult[] = [
  {
    id: '1',
    emotion: 'happy',
    confidence: 0.85,
    intensity: 0.7,
    timestamp: '2025-05-17T10:30:00Z',
    emojis: ['😊', '😃'],
    source: 'facial',
    text: 'I feel happy about my progress today',
    feedback: 'Great job on maintaining a positive outlook!'
  },
  {
    id: '2',
    emotion: 'calm',
    confidence: 0.76,
    intensity: 0.6,
    timestamp: '2025-05-16T15:45:00Z',
    emojis: ['😌', '😊'],
    source: 'voice',
    text: 'Just finished a meditation session',
    feedback: 'Your voice tone indicates a peaceful state of mind'
  },
  {
    id: '3',
    emotion: 'stressed',
    confidence: 0.68,
    intensity: 0.75,
    timestamp: '2025-05-15T09:20:00Z',
    emojis: ['😓', '😰'],
    source: 'text',
    text: 'Struggling with multiple deadlines this week',
    feedback: 'I notice you\'re feeling overwhelmed. Let\'s work on prioritizing tasks.'
  },
  {
    id: '4',
    emotion: 'tired',
    confidence: 0.72,
    intensity: 0.65,
    timestamp: '2025-05-14T21:00:00Z',
    emojis: ['😴', '🥱'],
    source: 'system',
    text: 'Long day, feeling exhausted but accomplished',
    feedback: 'You seem tired but satisfied. Consider getting proper rest tonight.'
  },
  {
    id: '5',
    emotion: 'excited',
    confidence: 0.88,
    intensity: 0.9,
    timestamp: '2025-05-13T18:30:00Z',
    emojis: ['😃', '🤩'],
    source: 'facial',
    text: 'Just got amazing news about the project!',
    feedback: 'Your excitement is contagious! Great to see such positive energy.'
  }
];

export default mockEmotionResults;
