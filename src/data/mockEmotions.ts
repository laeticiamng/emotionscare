
import { EmotionResult } from '@/types/emotion';

// Sample emotion results for testing
export const mockEmotionResults: EmotionResult[] = [
  {
    id: 'emotion-1',
    emotion: 'happy',
    confidence: 0.85,
    intensity: 0.9,
    timestamp: '2025-05-18T08:30:00.000Z',
    emojis: ['😊', '😃'],
    source: 'voice',
    text: 'Je me sens vraiment bien aujourd\'hui',
    feedback: 'Continuez comme ça !',
    emotions: {
      happy: 0.85,
      calm: 0.1,
      anxious: 0.02,
      sad: 0.03
    }
  },
  {
    id: 'emotion-2',
    emotion: 'stressed',
    confidence: 0.78,
    intensity: 0.65,
    timestamp: '2025-05-17T16:45:00.000Z',
    emojis: ['😓', '😰'],
    source: 'text',
    text: 'Journée difficile avec beaucoup de pression',
    feedback: 'Prenez un moment pour vous détendre',
    emotions: {
      stressed: 0.78,
      anxious: 0.15,
      tired: 0.05,
      sad: 0.02
    }
  },
  {
    id: 'emotion-3',
    emotion: 'calm',
    confidence: 0.92,
    intensity: 0.8,
    timestamp: '2025-05-16T20:15:00.000Z',
    emojis: ['😌', '🧘'],
    source: 'voice',
    text: 'Je me sens détendu après ma séance de méditation',
    feedback: 'Excellent état de calme intérieur',
    emotions: {
      calm: 0.92,
      happy: 0.05,
      focused: 0.03
    }
  },
  {
    id: 'emotion-4',
    emotion: 'tired',
    confidence: 0.75,
    intensity: 0.6,
    timestamp: '2025-05-15T22:30:00.000Z',
    emojis: ['😴', '🥱'],
    source: 'emoji',
    text: 'Journée épuisante, besoin de repos',
    feedback: 'Priorisez votre sommeil ce soir',
    emotions: {
      tired: 0.75,
      stressed: 0.15,
      calm: 0.05,
      happy: 0.05
    }
  },
  {
    id: 'emotion-5',
    emotion: 'motivated',
    confidence: 0.88,
    intensity: 0.85,
    timestamp: '2025-05-14T09:00:00.000Z',
    emojis: ['💪', '🔥'],
    source: 'text',
    text: 'Prêt à relever tous les défis aujourd\'hui',
    feedback: 'Votre énergie est contagieuse !',
    emotions: {
      motivated: 0.88,
      happy: 0.1,
      focused: 0.02
    }
  }
];
