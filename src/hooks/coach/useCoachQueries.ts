
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { coachService } from '@/lib/coach/coach-service';
import { useActivity } from '@/hooks/useActivity';
import { UserContext } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to handle direct queries to the coach AI
 */
export function useCoachQueries(generateRecommendation: () => Promise<void>) {
  const { user } = useAuth();
  const { logActivity } = useActivity();
  const { toast } = useToast();

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
      
      // Contexte utilisateur à envoyer à l'API
      const userContext: UserContext = {
        recentEmotions: null,
        currentScore: null,
        lastEmotionDate: undefined
      };
      
      // Appel à l'API du coach - The error is here, we're passing 3 arguments when the method only expects 2
      // Let's check the implementation of askCoachQuestion in coachService and fix this
      const response = await coachService.askCoachQuestion(user.id, question);
      return response;
    } catch (error) {
      console.error('Error asking coach question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de communiquer avec le coach IA. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
      return "Je suis désolé, mais je rencontre des difficultés techniques pour répondre à votre question. Veuillez réessayer plus tard.";
    }
  }, [user, generateRecommendation, logActivity, toast]);

  return { askQuestion };
}
