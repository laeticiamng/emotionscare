
import { useState, useCallback } from 'react';
import { emotionsCareApi } from '@/services/emotionsCareApi';
import { toast } from '@/hooks/use-toast';

export const useEmotionsCareApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeEmotion = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await emotionsCareApi.analyzeEmotion(text);
      toast({
        title: "Analyse terminée",
        description: "Votre émotion a été analysée avec succès",
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeVoice = useCallback(async (audioBlob: Blob) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await emotionsCareApi.analyzeVoiceEmotion(audioBlob);
      toast({
        title: "Analyse vocale terminée",
        description: "Votre voix a été analysée avec succès",
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse vocale';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const chatWithCoach = useCallback(async (message: string, history?: any[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await emotionsCareApi.chatWithCoach(message, history);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chat';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await emotionsCareApi.getDashboardData();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du tableau de bord';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveJournalEntry = useCallback(async (content: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await emotionsCareApi.saveJournalEntry(content);
      toast({
        title: "Entrée sauvegardée",
        description: "Votre entrée de journal a été sauvegardée",
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    analyzeEmotion,
    analyzeVoice,
    chatWithCoach,
    getDashboardData,
    saveJournalEntry,
  };
};
