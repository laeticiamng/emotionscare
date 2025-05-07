
import { supabase } from '@/integrations/supabase/client';

// Types des données de recommandation
export interface EmotionRecommendation {
  id?: string;
  emotion: string;
  category: 'music' | 'vr' | 'exercise' | 'mindfulness' | 'general';
  content: string;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number; // minutes
  tags?: string[];
}

// Mapper des émotions vers des catégories de recommandations
const emotionToCategoryMap: Record<string, string[]> = {
  happy: ['music', 'exercise', 'general'],
  sad: ['music', 'mindfulness', 'vr'],
  angry: ['mindfulness', 'music', 'exercise'],
  anxious: ['mindfulness', 'vr', 'music'],
  calm: ['music', 'mindfulness', 'general'],
  focused: ['music', 'general', 'exercise'],
  tired: ['music', 'vr', 'mindfulness'],
  stressed: ['mindfulness', 'vr', 'music'],
  neutral: ['music', 'general', 'mindfulness']
};

/**
 * Service de recommandation basé sur les émotions
 */
export const emotionRecommendationService = {
  /**
   * Obtenir des recommandations basées sur une émotion
   */
  async getRecommendationsForEmotion(emotion: string, limit: number = 3): Promise<EmotionRecommendation[]> {
    try {
      // Normaliser l'émotion
      const normalizedEmotion = emotion.toLowerCase();
      
      // Obtenir les catégories de recommandation pour cette émotion
      const categories = emotionToCategoryMap[normalizedEmotion] || ['general', 'music', 'mindfulness'];
      
      // Récupérer des recommandations depuis Supabase ou API externe
      // Ici nous simulons avec des données statiques
      return this.getMockRecommendations(normalizedEmotion, categories, limit);
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
      return [];
    }
  },
  
  /**
   * Générer une recommandation avec l'API IA
   */
  async generateRecommendation(emotion: string, category: string): Promise<string> {
    try {
      // Construire le prompt pour l'IA
      const prompt = `Donne-moi un conseil court (max 150 caractères) pour une personne qui ressent "${emotion}" dans la catégorie "${category}".`;
      
      // Appeler l'IA via la fonction Edge de Supabase
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: prompt,
          userContext: { recentEmotions: emotion },
          model: "gpt-4o-mini",
          temperature: 0.3,
          max_tokens: 100
        }
      });
      
      if (error) throw error;
      
      const recommendation = data?.response || 
        `Conseil par défaut pour ${emotion} dans la catégorie ${category}.`;
      
      return recommendation;
    } catch (error) {
      console.error('Erreur lors de la génération de recommandation IA:', error);
      return `Prenez un moment pour vous aujourd'hui. Même 5 minutes peuvent faire une différence.`;
    }
  },
  
  /**
   * Données simulées pour démonstration
   */
  getMockRecommendations(emotion: string, categories: string[], limit: number): EmotionRecommendation[] {
    const mockData: Record<string, EmotionRecommendation[]> = {
      happy: [
        { emotion: 'happy', category: 'music', content: 'Écoutez notre playlist "Énergétique" pour maintenir cette bonne humeur tout au long de la journée.' },
        { emotion: 'happy', category: 'exercise', content: 'Profitez de cette énergie positive avec une courte session d'exercice de 15 minutes en plein air.' },
        { emotion: 'happy', category: 'general', content: 'Partagez cette joie avec quelqu\'un autour de vous aujourd\'hui!' }
      ],
      sad: [
        { emotion: 'sad', category: 'music', content: 'Notre sélection "Sérénité" peut vous aider à traverser ce moment difficile avec douceur.' },
        { emotion: 'sad', category: 'mindfulness', content: 'Prenez 5 minutes pour pratiquer une respiration profonde et accepter vos émotions sans jugement.' },
        { emotion: 'sad', category: 'vr', content: 'Une session VR dans notre environnement "Plage relaxante" pourrait vous aider à changer de perspective.' }
      ],
      calm: [
        { emotion: 'calm', category: 'music', content: 'Maintenez votre tranquillité avec notre playlist "Concentration Zen".' },
        { emotion: 'calm', category: 'mindfulness', content: 'C\'est le moment idéal pour une séance de méditation guidée de 10 minutes.' },
        { emotion: 'calm', category: 'general', content: 'Profitez de cet état d\'esprit pour avancer sur des tâches demandant de la concentration.' }
      ],
      neutral: [
        { emotion: 'neutral', category: 'music', content: 'Découvrez notre playlist "Énergie douce" pour dynamiser légèrement votre journée.' },
        { emotion: 'neutral', category: 'general', content: 'Prenez quelques instants pour définir votre intention principale pour aujourd\'hui.' },
        { emotion: 'neutral', category: 'mindfulness', content: 'Un petit scan corporel de 3 minutes pourrait vous aider à identifier vos besoins du moment.' }
      ]
    };
    
    // Utiliser les recommandations spécifiques à l'émotion ou par défaut
    const recommendations = mockData[emotion] || mockData.neutral;
    
    // Filtrer par catégories si spécifiées
    const filtered = categories.length ? 
      recommendations.filter(rec => categories.includes(rec.category)) : 
      recommendations;
    
    // Retourner le nombre demandé de recommandations
    return filtered.slice(0, limit);
  }
};

export default emotionRecommendationService;
