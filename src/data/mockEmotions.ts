
import { Emotion } from '../types';

// Mock emotion entries
export const mockEmotions: Emotion[] = [
  {
    id: '1',
    user_id: 'user-1',
    date: '2023-04-10T09:00:00Z',
    emotion: 'happy',
    confidence: 0.85,
    intensity: 0.7,
    emojis: ['😊', '😄', '🙂'], // Now supported as string[] in the interface
    text: "J'ai eu une excellente réunion d'équipe ce matin !",
    score: 0.8
  },
  {
    id: '2',
    user_id: 'user-1',
    date: '2023-04-11T15:30:00Z',
    emotion: 'stressed',
    confidence: 0.9,
    intensity: 0.6,
    emojis: ['😓', '😖', '😣'], // Now supported as string[] in the interface
    text: "Beaucoup de deadlines cette semaine, je me sens un peu dépassé.",
    score: 0.3
  },
  {
    id: '3',
    user_id: 'user-1',
    date: '2023-04-12T10:15:00Z',
    emotion: 'calm',
    confidence: 0.75,
    intensity: 0.5,
    emojis: ['😌', '🧘', '🌿'], // Now supported as string[] in the interface
    text: "J'ai pratiqué la méditation ce matin et je me sens plus centré.",
    score: 0.7
  },
  {
    id: '4',
    user_id: 'user-1',
    date: '2023-04-13T18:45:00Z',
    emotion: 'tired',
    confidence: 0.8,
    intensity: 0.6,
    emojis: ['😴', '🥱', '💤'], // Now supported as string[] in the interface
    text: "Longue journée, j'ai besoin de repos.",
    score: 0.4,
    ai_feedback: "Vous semblez avoir besoin de récupérer. Essayez de vous coucher plus tôt ce soir et prenez 10 minutes pour vous détendre avant le coucher. La musique relaxante peut aider à favoriser un sommeil réparateur."
  }
];

export default mockEmotions;
