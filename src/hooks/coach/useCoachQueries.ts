
import { useQuery } from '@tanstack/react-query';
import { useCoach } from '@/contexts/CoachContext';

interface CoachService {
  askQuestion: (question: string) => Promise<string>;
}

interface ExtendedCoachContext {
  coachService: CoachService | null;
}

export function useCoachQueries() {
  const context = useCoach() as ExtendedCoachContext;
  const { coachService } = context || { coachService: null };

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
