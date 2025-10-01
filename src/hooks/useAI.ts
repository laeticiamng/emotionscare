// @ts-nocheck

import { useState, useCallback } from 'react';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const openaiText = useCallback(async (prompt: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `Réponse du coach IA à: "${prompt}"`;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    openaiText,
    isLoading
  };
};
