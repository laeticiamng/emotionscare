
import { useQuery } from '@tanstack/react-query';

interface CoachService {
  askQuestion: (question: string) => Promise<string>;
}

export interface CoachContextType {
  coachService?: CoachService | null;
}

interface ExtendedCoachContext {
  coachService: CoachService | null;
}

// Mock implementation of useCoach to resolve the error
export const useCoach = (): CoachContextType => {
  return {
    coachService: {
      askQuestion: async (question: string) => {
        return `Réponse à: ${question}`;
      }
    }
  };
};

export function useCoachQueries() {
  const context = useCoach();
  // Cast context to ExtendedCoachContext
  const { coachService } = context as unknown as ExtendedCoachContext;

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
