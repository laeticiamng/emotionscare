
import { Emotion } from '@/types';

// Données fictives d'émotions pour les tests et le développement
export const mockEmotions: Emotion[] = [
  {
    id: '1',
    user_id: 'user-1',
    date: new Date(Date.now() - 86400000).toISOString(),
    emotion: 'joy',
    name: 'Joy', 
    score: 0.85,
    confidence: 0.92,
    intensity: 0.8,
    color: '#FFD700',
    text: 'I feel really happy today after completing my project!',
  },
  {
    id: '2',
    user_id: 'user-1',
    date: new Date(Date.now() - 172800000).toISOString(),
    emotion: 'sadness',
    name: 'Sadness', 
    score: 0.65,
    confidence: 0.78,
    intensity: 0.6,
    color: '#6495ED',
    text: 'I miss my family back home.',
  },
  {
    id: '3',
    user_id: 'user-1',
    date: new Date(Date.now() - 259200000).toISOString(),
    emotion: 'anxiety',
    name: 'Anxiety', 
    score: 0.75,
    confidence: 0.82,
    intensity: 0.7,
    color: '#FF6347',
    text: 'Feeling nervous about tomorrow\'s presentation.',
  },
  {
    id: '4',
    user_id: 'user-2',
    date: new Date(Date.now() - 86400000).toISOString(),
    emotion: 'calm',
    name: 'Calm', 
    score: 0.9,
    confidence: 0.95,
    intensity: 0.85,
    color: '#20B2AA',
    text: 'Meditation this morning really helped me focus.',
  },
];

export default mockEmotions;
