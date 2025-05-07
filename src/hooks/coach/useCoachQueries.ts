
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { coachService } from '@/lib/coach/coach-service';
import { useActivity } from '@/hooks/useActivity';

/**
 * Hook to handle direct queries to the coach AI
 */
export function useCoachQueries(generateRecommendation: () => Promise<void>) {
  const { user } = useAuth();
  const { logActivity } = useActivity();

  // Pour poser une question directe au coach IA
  const askQuestion = useCallback(async (question: string): Promise<string> => {
    if (!user?.id) return "Veuillez vous connecter pour utiliser le coach IA.";
    
    try {
      // Log activity
      logActivity('coach_interaction', { type: 'question', content: question });
      
      // Obtenir de nouvelles recommandations basées sur la question
      try {
        await generateRecommendation();
      } catch (recError) {
        console.log('Non-critical error generating recommendations:', recError);
      }
      
      return await coachService.askCoachQuestion(user.id, question);
    } catch (error) {
      console.error('Error asking coach question:', error);
      return "Je suis désolé, mais je rencontre des difficultés techniques pour répondre à votre question. Veuillez réessayer plus tard.";
    }
  }, [user, generateRecommendation, logActivity]);

  return { askQuestion };
}
