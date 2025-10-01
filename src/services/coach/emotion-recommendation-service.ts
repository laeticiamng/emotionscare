// @ts-nocheck

/**
 * Service pour générer des recommandations basées sur les émotions
 */

export interface EmotionRecommendation {
  emotion?: string;
  category?: 'music' | 'vr' | 'exercise' | 'mindfulness' | 'general';
  content: string;
  title?: string;
}

// Mock service - in a real app this would connect to a backend
class EmotionRecommendationService {
  async getRecommendationsForEmotion(
    emotion: string,
    limit: number = 3
  ): Promise<EmotionRecommendation[]> {
    // Mock implementation
    const recommendations: Record<string, EmotionRecommendation[]> = {
      'happy': [
        { 
          emotion: 'happy', 
          category: 'music', 
          content: 'Écoutez des musiques uplifting pour maintenir votre énergie positive.',
          title: 'Musique énergisante'
        },
        { 
          emotion: 'happy', 
          category: 'mindfulness', 
          content: 'Prenez un moment pour savourer cette émotion positive et en être reconnaissant.',
          title: 'Gratitude'
        }
      ],
      'anxious': [
        { 
          emotion: 'anxious', 
          category: 'mindfulness', 
          content: 'Pratiquez la respiration 4-7-8 pour calmer votre système nerveux.',
          title: 'Exercice de respiration'
        },
        { 
          emotion: 'anxious', 
          category: 'music', 
          content: 'Écoutez des sons de la nature pour réduire votre niveau de stress.',
          title: 'Sons apaisants'
        }
      ],
      'sad': [
        { 
          emotion: 'sad', 
          category: 'exercise', 
          content: 'Une courte marche de 10 minutes peut aider à libérer des endorphines.',
          title: 'Activité physique légère'
        },
        { 
          emotion: 'sad', 
          category: 'music', 
          content: 'Une playlist de chansons positives peut aider à élever votre humeur.',
          title: 'Musique réconfortante'
        }
      ],
      'neutral': [
        { 
          emotion: 'neutral', 
          category: 'general', 
          content: 'C\'est un bon moment pour planifier vos activités ou réfléchir à vos objectifs.',
          title: 'Planification'
        }
      ]
    };
    
    return recommendations[emotion.toLowerCase()] || 
      recommendations['neutral'] || 
      [{ emotion, category: 'general', content: 'Prenez soin de vous aujourd\'hui.' }];
  }
  
  async generateRecommendation(
    emotion: string,
    category: string
  ): Promise<string> {
    // Mock implementation
    const recommendationsByCategory: Record<string, Record<string, string>> = {
      'music': {
        'happy': 'Écoutez des chansons énergiques qui vous font sourire.',
        'sad': 'Des mélodies douces et apaisantes peuvent vous réconforter.',
        'anxious': 'La musique classique peut aider à calmer votre esprit.',
        'neutral': 'Explorez de nouveaux genres musicaux aujourd\'hui.'
      },
      'vr': {
        'happy': 'Une expérience VR de plein air pourrait amplifier votre bonne humeur.',
        'sad': 'Une séance de méditation VR dans un environnement calme pourrait vous apaiser.',
        'anxious': 'Un environnement VR paisible comme une plage ou une forêt pourrait vous aider.',
        'neutral': 'C\'est un bon moment pour explorer de nouvelles expériences VR.'
      },
      'exercise': {
        'happy': 'Canalisez cette énergie positive dans une activité physique dynamique.',
        'sad': 'Un yoga doux peut aider à équilibrer vos émotions.',
        'anxious': 'Des exercices de respiration et d\'étirement peuvent calmer votre esprit.',
        'neutral': 'Une marche revigorante pourrait vous stimuler.'
      }
    };
    
    return recommendationsByCategory[category]?.[emotion.toLowerCase()] || 
           'Prenez un moment pour vous aujourd\'hui.';
  }
}

export const emotionRecommendationService = new EmotionRecommendationService();
export default emotionRecommendationService;
