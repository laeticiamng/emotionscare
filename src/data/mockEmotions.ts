
import { Emotion } from '../types';

export const mockEmotions: Emotion[] = [
  {
    id: '1',
    user_id: 'user123',
    date: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 jours avant
    emotion: 'joy',
    name: 'joy',
    category: 'positive',
    score: 8,
    text: 'Je me sens vraiment bien aujourd\'hui !',
    confidence: 0.85,
    intensity: 0.8
  },
  {
    id: '2',
    user_id: 'user123',
    date: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 jours avant
    emotion: 'neutral',
    name: 'neutral',
    category: 'neutral',
    score: 5,
    text: 'Journée ordinaire, rien de spécial.',
    confidence: 0.7,
    intensity: 0.5
  },
  {
    id: '3',
    user_id: 'user123',
    date: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 jours avant
    emotion: 'sadness',
    name: 'sadness',
    category: 'negative',
    score: 3,
    text: 'Je me sens un peu triste aujourd\'hui.',
    confidence: 0.75,
    intensity: 0.6
  },
  {
    id: '4',
    user_id: 'user123',
    date: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 jour avant
    emotion: 'anger',
    name: 'anger',
    category: 'negative',
    score: 2,
    text: 'Je suis vraiment frustré par ce qui s\'est passé.',
    confidence: 0.9,
    intensity: 0.85
  },
  {
    id: '5',
    user_id: 'user123',
    date: new Date().toISOString(), // Aujourd'hui
    emotion: 'excited',
    name: 'excited',
    category: 'positive',
    score: 9,
    text: 'Je suis super enthousiaste pour le nouveau projet !',
    confidence: 0.88,
    intensity: 0.9
  }
];

export const getRandomEmotion = (): Emotion => {
  const emotions = ['joy', 'neutral', 'sadness', 'anger', 'excited', 'calm', 'stressed', 'anxious'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const score = Math.floor(Math.random() * 10) + 1;
  
  return {
    id: `random-${Date.now()}`,
    user_id: 'user123',
    date: new Date().toISOString(),
    emotion: randomEmotion,
    name: randomEmotion,
    category: score > 5 ? 'positive' : (score < 4 ? 'negative' : 'neutral'),
    score: score,
    confidence: 0.7 + Math.random() * 0.3,
    intensity: Math.random() * 0.9 + 0.1
  };
};

export default mockEmotions;
