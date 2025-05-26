
import { useState } from 'react';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulation d'appel à l'API OpenAI
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = `Réponse générée pour: "${prompt}"`;
      return mockResponse;
    } catch (err) {
      setError('Erreur lors de la génération de la réponse');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    isLoading,
    error
  };
};

export default useOpenAI;
