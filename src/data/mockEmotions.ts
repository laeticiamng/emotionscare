import { Emotion } from '@/types';

export const mockEmotions: Emotion[] = [
  {
    id: '1',
    emotion: 'joy',
    score: 0.85,
    date: '2024-05-14',
    userId: 'user1',
    aiFeedback: 'Vous avez l\'air heureux(se) !'
  },
  {
    id: '2',
    emotion: 'sadness',
    score: 0.32,
    date: '2024-05-13',
    userId: 'user1',
    aiFeedback: 'Un coup de blues, peut-être besoin de souffler.'
  },
  {
    id: '3',
    emotion: 'anger',
    score: 0.67,
    date: '2024-05-12',
    userId: 'user2',
    aiFeedback: 'Respirez profondément, ça va passer.'
  }
  // On peut ajouter d'autres objets ici, **toujours séparés par des virgules**
];
