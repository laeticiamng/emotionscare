
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { checkApiConnection } from '@/lib/ai/openai-client';
import { AIModule } from '@/lib/ai/openai-config';
import * as journalService from '@/lib/ai/journal-service';
import * as vrService from '@/lib/ai/vr-script-service';
import * as lyricsService from '@/lib/ai/lyrics-service';
import * as moderationService from '@/lib/ai/moderation-service';
import * as challengeService from '@/lib/ai/challenge-service';
import * as analyticsService from '@/lib/ai/analytics-service';
import * as hrService from '@/lib/ai/hr-insights-service';

/**
 * Hook permettant d'utiliser les fonctionnalités OpenAI dans les composants React
 */
export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAPIReady, setIsAPIReady] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Vérifier si l'API est accessible
  const checkAPI = useCallback(async () => {
    try {
      setIsLoading(true);
      const isConnected = await checkApiConnection();
      setIsAPIReady(isConnected);
      
      if (!isConnected) {
        toast({
          title: "Erreur de connexion API",
          description: "Impossible de se connecter à l'API OpenAI. Vérifiez votre clé API.",
          variant: "destructive"
        });
      }
      
      return isConnected;
    } catch (error) {
      console.error("API connection error:", error);
      setIsAPIReady(false);
      setError("Erreur de connexion à l'API");
      
      toast({
        title: "Erreur de connexion",
        description: "Impossible de vérifier l'état de l'API.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Exécuter une fonction IA avec gestion d'état
  const executeAIAction = useCallback(async <T,>(
    action: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (loadingMessage) {
        toast({
          title: "Traitement en cours",
          description: loadingMessage,
        });
      }
      
      const result = await action();
      return result;
    } catch (error) {
      console.error("AI action error:", error);
      setError((error as Error).message || "Erreur lors de l'exécution");
      
      toast({
        title: "Erreur",
        description: (error as Error).message || "Une erreur est survenue",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    // État
    isLoading,
    error,
    isAPIReady,
    checkAPI,
    
    // Services
    journal: {
      analyzeEmotionalJournal: (entry: string, context?: any) => 
        executeAIAction(() => journalService.analyzeEmotionalJournal(entry, context), 
        "Analyse de votre journal en cours...")
    },
    vr: {
      generateScript: (emotion: string, description?: string, duration?: number, theme?: string) => 
        executeAIAction(() => vrService.generateVRScript(emotion, description, duration, theme),
        "Génération du script immersif en cours...")
    },
    music: {
      generateLyrics: (emotion: string, theme?: string, genre?: string, language?: string) => 
        executeAIAction(() => lyricsService.generateLyrics(emotion, theme, genre, language),
        "Création de paroles personnalisées en cours...")
    },
    moderation: {
      checkContent: (content: string) => 
        executeAIAction(() => moderationService.checkContentSafety(content))
    },
    challenges: {
      generateChallenge: (emotion: string, preferences?: string[], previousChallenges?: string[]) => 
        executeAIAction(() => challengeService.generateDailyChallenge(emotion, preferences, previousChallenges),
        "Création de votre défi personnalisé...")
    },
    admin: {
      generateAnalytics: (data: any, timeframe?: 'daily' | 'weekly' | 'monthly') => 
        executeAIAction(() => analyticsService.generateAnalyticsInsights(data, timeframe),
        "Génération du rapport d'analyse...")
    },
    hr: {
      generateInsights: (data: any, timeframe?: 'daily' | 'weekly' | 'monthly') => 
        executeAIAction(() => hrService.generateHRInsights(data, timeframe),
        "Génération des recommandations RH...")
    }
  };
}
