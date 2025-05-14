
import { EmotionResult, Recommendation } from '@/types/types';

export const getRecommendationsForEmotion = (emotion: string): Recommendation[] => {
  switch (emotion.toLowerCase()) {
    case 'joy':
    case 'happy':
      return [
        {
          id: 'joy-1',
          title: 'Partager votre joie',
          description: 'Partagez votre état positif avec un proche.',
          category: 'social',
          priority: 1,
          confidence: 0.9
        },
        {
          id: 'joy-2',
          title: 'Journal de gratitude',
          description: 'Notez trois choses qui vous rendent reconnaissant aujourd\'hui.',
          category: 'mindfulness',
          priority: 2,
          confidence: 0.85
        }
      ];
      
    case 'sad':
    case 'sadness':
      return [
        {
          id: 'sad-1',
          title: 'Méditation guidée',
          description: 'Prenez 5 minutes pour une méditation axée sur l\'acceptation.',
          category: 'mindfulness',
          priority: 1,
          confidence: 0.9,
          actionUrl: '/vr',
          actionLabel: 'Démarrer'
        },
        {
          id: 'sad-2',
          title: 'Musique apaisante',
          description: 'Écoutez une playlist conçue pour améliorer votre humeur.',
          category: 'content',
          priority: 2,
          confidence: 0.8,
          actionUrl: '/music',
          actionLabel: 'Écouter'
        }
      ];
      
    case 'stressed':
    case 'stress':
    case 'anxiety':
    case 'anxious':
      return [
        {
          id: 'stress-1',
          title: 'Respiration profonde',
          description: 'Prenez 2 minutes pour pratiquer la respiration 4-7-8.',
          category: 'exercise',
          priority: 1,
          confidence: 0.95
        },
        {
          id: 'stress-2',
          title: 'Pause VR',
          description: 'Immergez-vous dans un environnement calme pendant 5 minutes.',
          category: 'relaxation',
          priority: 2,
          confidence: 0.85,
          actionUrl: '/vr',
          actionLabel: 'Commencer'
        }
      ];
      
    default:
      return [
        {
          id: 'default-1',
          title: 'Scan émotionnel',
          description: 'Faites un nouveau scan pour obtenir des recommandations personnalisées.',
          category: 'insight',
          priority: 1,
          confidence: 0.7,
          actionUrl: '/scan',
          actionLabel: 'Scanner'
        }
      ];
  }
};

export const getPersonalizedRecommendations = (userId: string, emotionResults: EmotionResult[]): Recommendation[] => {
  // In a real app, this would use the user's history, preferences, and current emotional state
  // to generate highly personalized recommendations
  
  if (!emotionResults || emotionResults.length === 0) {
    return [
      {
        id: 'personal-1',
        title: 'Premier scan émotionnel',
        description: 'Faites votre premier scan pour débloquer des recommandations personnalisées.',
        category: 'onboarding',
        priority: 1,
        confidence: 1.0
      }
    ];
  }
  
  // Use the most recent emotion to generate recommendations
  const latestEmotion = emotionResults[0];
  return getRecommendationsForEmotion(latestEmotion.emotion);
};

export default {
  getRecommendationsForEmotion,
  getPersonalizedRecommendations
};
