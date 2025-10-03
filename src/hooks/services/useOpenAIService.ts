import { useState, useCallback } from 'react';
import { openaiService } from '@/services';
import type { ApiResponse } from '@/services/types';

interface OpenAIServiceHook {
  // État
  isProcessing: boolean;
  lastResponse: any;
  error: string | null;
  
  // Services de coaching
  generateCoachingResponse: (
    messages: Array<{ role: string; content: string }>,
    context?: any
  ) => Promise<ApiResponse>;
  
  // Analyse de journal
  analyzeJournalEntry: (entry: string, previousAnalyses?: any[]) => Promise<ApiResponse>;
  
  // Génération de contenu personnalisé
  generatePersonalizedContent: (
    type: 'affirmation' | 'meditation' | 'exercise',
    userProfile: any
  ) => Promise<ApiResponse>;
  
  // Modération de contenu
  moderateContent: (content: string) => Promise<ApiResponse>;
  
  // Transcription audio
  transcribeAudio: (audioFile: File) => Promise<ApiResponse>;
  
  // Utilitaires
  reset: () => void;
}

export const useOpenAIService = (): OpenAIServiceHook => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Générer une réponse de coaching
  const generateCoachingResponse = useCallback(async (
    messages: Array<{ role: string; content: string }>,
    context?: {
      emotionalState?: string;
      userGoals?: string[];
      sessionHistory?: any[];
    }
  ): Promise<ApiResponse> => {
    if (!messages.length) {
      const error = 'Messages requis pour le coaching';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await openaiService.generateCoachingResponse(messages, context);
      
      if (response.success && response.data) {
        setLastResponse(response.data);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la génération de coaching';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Analyser une entrée de journal
  const analyzeJournalEntry = useCallback(async (
    entry: string,
    previousAnalyses?: any[]
  ): Promise<ApiResponse> => {
    if (!entry.trim()) {
      const error = 'Entrée de journal requise';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await openaiService.analyzeJournalEntry(entry, previousAnalyses);
      
      if (response.success && response.data) {
        setLastResponse(response.data);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'analyse du journal';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Générer du contenu personnalisé
  const generatePersonalizedContent = useCallback(async (
    type: 'affirmation' | 'meditation' | 'exercise',
    userProfile: {
      name?: string;
      preferences?: string[];
      currentMood?: string;
      goals?: string[];
    }
  ): Promise<ApiResponse> => {
    if (!userProfile.currentMood) {
      const error = 'Humeur actuelle requise pour la personnalisation';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await openaiService.generatePersonalizedContent(type, userProfile);
      
      if (response.success && response.data) {
        setLastResponse(response.data);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la génération de contenu';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Modérer du contenu
  const moderateContent = useCallback(async (content: string): Promise<ApiResponse> => {
    if (!content.trim()) {
      const error = 'Contenu requis pour la modération';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await openaiService.moderateContent(content);
      
      if (response.success && response.data) {
        setLastResponse(response.data);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la modération';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Transcrire un fichier audio
  const transcribeAudio = useCallback(async (audioFile: File): Promise<ApiResponse> => {
    if (!audioFile) {
      const error = 'Fichier audio requis';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    // Vérifier le type de fichier
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/webm'];
    if (!validTypes.includes(audioFile.type)) {
      const error = 'Format audio non supporté. Utilisez WAV, MP3, OGG ou WebM.';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    // Vérifier la taille (max 25MB pour OpenAI)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      const error = 'Fichier trop volumineux. Maximum 25MB autorisé.';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await openaiService.transcribeAudio(audioFile);
      
      if (response.success && response.data) {
        setLastResponse(response.data);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la transcription';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    setLastResponse(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    // État
    isProcessing,
    lastResponse,
    error,
    
    // Méthodes
    generateCoachingResponse,
    analyzeJournalEntry,
    generatePersonalizedContent,
    moderateContent,
    transcribeAudio,
    reset
  };
};