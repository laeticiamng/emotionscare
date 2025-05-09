
import { useQuery } from '@tanstack/react-query';
import { useCoach } from '@/contexts/CoachContext';

export function useCoachQueries() {
  const { coachService } = useCoach() || { coachService: null };

  const askQuestion = (question: string) => {
    return useQuery({
      queryKey: ['coach', 'askQuestion', question],
      queryFn: async () => {
        if (!coachService) {
          return "Je ne peux pas répondre pour le moment. Service non disponible.";
        }
        try {
          const response = await coachService.askQuestion(question);
          return response;
        } catch (error) {
          console.error("Error asking question:", error);
          return "Désolé, je n'ai pas pu traiter votre question.";
        }
      },
      enabled: !!question && !!coachService,
    });
  };

  return {
    askQuestion,
  };
}
