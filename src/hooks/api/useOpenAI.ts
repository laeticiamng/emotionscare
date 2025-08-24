
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAIRequest {
  prompt?: string;
  messages?: OpenAIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface OpenAIResponse {
  generatedText: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (request: OpenAIRequest): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('openai-chat', {
        body: request
      });

      if (functionError) {
        throw new Error(functionError.message || 'Erreur lors de l\'appel à OpenAI');
      }

      return data?.generatedText || '';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération de la réponse';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateText = async (request: OpenAIRequest): Promise<string> => {
    return generateResponse(request);
  };

  return {
    generateResponse,
    generateText,
    isLoading,
    error
  };
};

export default useOpenAI;
