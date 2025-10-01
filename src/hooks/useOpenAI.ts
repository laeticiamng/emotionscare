// @ts-nocheck

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OpenAIRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface OpenAIResponse {
  response: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = async (request: OpenAIRequest): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [
            { role: 'user', content: request.prompt }
          ],
          model: request.model || 'gpt-4o-mini',
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 1000
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      return data?.response || null;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la génération de texte';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateText,
    isLoading,
    error
  };
};
