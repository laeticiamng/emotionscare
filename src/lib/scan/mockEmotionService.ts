
import type { Emotion } from '@/types';

// Récupère les émotions d'un utilisateur (using mock data)
export async function getUserEmotions(userId: string): Promise<Emotion[]> {
  try {
    // Dans une vraie application, ceci serait une requête à Supabase
    // Pour l'instant, nous utilisons des données simulées
    const mockEmotions = [
      {
        id: '1',
        user_id: userId,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        emotion: 'Calme',
        score: 8,
        text: "Je me sens plus serein aujourd'hui après ma session VR",
        ai_feedback: "Votre niveau de sérénité est excellent. Continuez avec les pratiques de pleine conscience."
      },
      {
        id: '2',
        user_id: userId,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        emotion: 'Stressé',
        score: 4,
        text: "Journée difficile avec beaucoup de pression",
        ai_feedback: "Votre niveau de stress est élevé. Une session de micro-pause VR pourrait vous aider."
      },
      {
        id: '3',
        user_id: userId,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        emotion: 'Fatigué',
        score: 3,
        text: "Manque de sommeil cette semaine",
        ai_feedback: "La fatigue affecte votre bien-être. Essayez notre programme de sommeil."
      }
    ];
    
    return mockEmotions;
  } catch (error) {
    console.error('Error fetching user emotions:', error);
    throw new Error('Failed to fetch user emotions');
  }
}
