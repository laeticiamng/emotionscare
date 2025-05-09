
import React, { createContext, useContext, useState, useCallback } from 'react';

// Define the service type
interface CoachService {
  askQuestion: (question: string) => Promise<string>;
}

// Create a mock service implementation
const mockCoachService: CoachService = {
  askQuestion: async (question: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Very simple response generator
    if (question.toLowerCase().includes('stress')) {
      return "Pour gérer le stress, essayez la respiration profonde, la méditation ou une courte promenade. Prenez des pauses régulières pendant votre journée de travail.";
    } else if (question.toLowerCase().includes('fatigue')) {
      return "La fatigue peut être combattue en améliorant votre sommeil, en faisant de l'exercice régulièrement et en maintenant une alimentation équilibrée.";
    } else if (question.toLowerCase().includes('anxiété') || question.toLowerCase().includes('anxiete')) {
      return "Pour l'anxiété, essayez des techniques de pleine conscience, limitez votre consommation de caféine et n'hésitez pas à parler à un professionnel.";
    } else {
      return "Je suis là pour vous aider avec vos questions concernant votre bien-être émotionnel et mental. N'hésitez pas à me poser des questions spécifiques sur la gestion du stress, de l'anxiété ou des émotions au travail.";
    }
  }
};

// Define the context type
interface CoachContextType {
  coachService: CoachService | null;
  isAIAvailable: boolean;
  toggleAIAvailability: () => void;
}

// Create the context
const CoachContext = createContext<CoachContextType | undefined>(undefined);

// Create the provider component
export const CoachProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAIAvailable, setIsAIAvailable] = useState(true);
  const [service] = useState<CoachService>(mockCoachService);

  const toggleAIAvailability = useCallback(() => {
    setIsAIAvailable(prev => !prev);
  }, []);

  return (
    <CoachContext.Provider value={{
      coachService: isAIAvailable ? service : null,
      isAIAvailable,
      toggleAIAvailability
    }}>
      {children}
    </CoachContext.Provider>
  );
};

// Create a custom hook to use the context
export const useCoach = () => {
  const context = useContext(CoachContext);
  if (context === undefined) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
};
