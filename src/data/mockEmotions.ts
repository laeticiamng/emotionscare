
import { Emotion } from '../types';

// Mock Emotions
export const mockEmotions: Emotion[] = [
  {
    id: '1',
    user_id: '1',
    date: '2023-04-14T10:20:00Z',
    emotion: 'calm',
    intensity: 8,
    emojis: '😊😌',
    text: 'Je me sens bien aujourd\'hui, journée productive',
    ai_feedback: 'Votre humeur semble positive. Continuez à cultiver cette énergie positive!',
    score: 82,
  },
  {
    id: '2',
    user_id: '1',
    date: '2023-04-13T11:30:00Z',
    emotion: 'stress',
    intensity: 6,
    emojis: '😓😔',
    text: 'Journée difficile, beaucoup de stress',
    ai_feedback: 'Vous semblez ressentir du stress. Une pause VR de 5 minutes pourrait vous aider.',
    score: 45,
  },
];
