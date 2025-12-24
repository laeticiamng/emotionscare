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

// Default recommendations for fallback
const defaultRecommendations: Record<string, EmotionRecommendation[]> = {
  'happy': [
    { emotion: 'happy', category: 'music', content: 'Écoutez des musiques uplifting pour maintenir votre énergie positive.', title: 'Musique énergisante' },
    { emotion: 'happy', category: 'mindfulness', content: 'Prenez un moment pour savourer cette émotion positive et en être reconnaissant.', title: 'Gratitude' }
  ],
  'anxious': [
    { emotion: 'anxious', category: 'mindfulness', content: 'Pratiquez la respiration 4-7-8 pour calmer votre système nerveux.', title: 'Exercice de respiration' },
    { emotion: 'anxious', category: 'music', content: 'Écoutez des sons de la nature pour réduire votre niveau de stress.', title: 'Sons apaisants' }
  ],
  'sad': [
    { emotion: 'sad', category: 'exercise', content: 'Une courte marche de 10 minutes peut aider à libérer des endorphines.', title: 'Activité physique légère' },
    { emotion: 'sad', category: 'music', content: 'Une playlist de chansons positives peut aider à élever votre humeur.', title: 'Musique réconfortante' }
  ],
  'neutral': [
    { emotion: 'neutral', category: 'general', content: 'C\'est un bon moment pour planifier vos activités ou réfléchir à vos objectifs.', title: 'Planification' }
  ]
};

class EmotionRecommendationService {
  async getRecommendationsForEmotion(
    emotion: string,
    limit: number = 3
  ): Promise<EmotionRecommendation[]> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      // Try to get personalized recommendations from Supabase
      const { data: recsData } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('emotion', emotion.toLowerCase())
        .eq('is_active', true)
        .limit(limit);

      if (recsData && recsData.length > 0) {
        return recsData.map(r => ({
          emotion: r.emotion,
          category: r.category || 'general',
          content: r.content || r.description,
          title: r.title
        }));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }

    // Fallback to default recommendations
    return defaultRecommendations[emotion.toLowerCase()] ||
      defaultRecommendations['neutral'] ||
      [{ emotion, category: 'general', content: 'Prenez soin de vous aujourd\'hui.' }];
  }

  async generateRecommendation(
    emotion: string,
    category: string
  ): Promise<string> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');

      const { data: recData } = await supabase
        .from('ai_recommendations')
        .select('content')
        .eq('emotion', emotion.toLowerCase())
        .eq('category', category)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (recData?.content) {
        return recData.content;
      }
    } catch (error) {
      console.error('Error generating recommendation:', error);
    }

    // Fallback to category-based recommendations
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

  async saveUserRecommendation(
    userId: string,
    emotion: string,
    recommendation: EmotionRecommendation
  ): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.from('user_recommendations_history').insert({
        user_id: userId,
        emotion,
        recommendation_title: recommendation.title,
        recommendation_content: recommendation.content,
        category: recommendation.category,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving recommendation:', error);
    }
  }
}

export const emotionRecommendationService = new EmotionRecommendationService();
export default emotionRecommendationService;
