
import { Recommendation, EmotionResult } from '@/types';

export const generateRecommendation = async (emotionData: EmotionResult): Promise<Recommendation[]> => {
  // Mock implementation
  console.log('Generating recommendations based on emotion:', emotionData.emotion);
  
  const recommendations: Recommendation[] = [
    {
      id: crypto.randomUUID(),
      title: 'Pratiquez la pleine conscience',
      description: 'Une séance de 10 minutes pour vous recentrer et observer vos émotions.',
      category: 'mindfulness',
      priority: 1,
      confidence: 0.9,
      actionUrl: '/mindfulness/session',
      actionLabel: 'Commencer'
    },
    {
      id: crypto.randomUUID(),
      title: 'Écoutez de la musique adaptative',
      description: 'Des morceaux sélectionnés pour votre état émotionnel actuel.',
      category: 'music',
      priority: 2,
      confidence: 0.85,
      actionUrl: '/music',
      actionLabel: 'Écouter'
    },
    {
      id: crypto.randomUUID(),
      title: 'Exprimez-vous dans votre journal',
      description: 'Notez vos pensées et émotions pour mieux les comprendre.',
      category: 'journal',
      priority: 3,
      confidence: 0.8,
      actionUrl: '/journal/new',
      actionLabel: 'Noter'
    }
  ];
  
  return recommendations;
};

export default {
  generateRecommendation
};
