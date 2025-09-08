/**
 * HOOK UNIFIÉ - Analyse Émotionnelle Premium
 * Interface React optimisée pour le service d'analyse émotionnelle
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { unifiedEmotionService } from '@/services/UnifiedEmotionService';
import { 
  UnifiedEmotionAnalysis, 
  UnifiedScanSession, 
  SmartRecommendation,
  EmotionSource,
  ScanMode,
  EmotionInsight,
  AdaptiveAnalysisConfig 
} from '@/types/unified-emotions';

interface UseUnifiedEmotionOptions {
  autoSave?: boolean;
  realTimeUpdates?: boolean;
  enableBiometrics?: boolean;
  cacheResults?: boolean;
  maxRetries?: number;
}

interface UseUnifiedEmotionReturn {
  // État principal
  isAnalyzing: boolean;
  isSessionActive: boolean;
  error: string | null;
  
  // Données
  currentAnalysis: UnifiedEmotionAnalysis | null;
  currentSession: UnifiedScanSession | null;
  recommendations: SmartRecommendation[];
  insights: EmotionInsight[];
  
  // Actions principales
  analyzeEmotion: (params: AnalyzeEmotionParams) => Promise<UnifiedEmotionAnalysis | null>;
  startSession: (config: StartSessionConfig) => Promise<UnifiedScanSession | null>;
  endSession: () => Promise<UnifiedScanSession | null>;
  
  // Actions utilitaires
  getRecommendations: () => Promise<SmartRecommendation[]>;
  generateInsights: () => Promise<EmotionInsight[]>;
  clearError: () => void;
  reset: () => void;
}

interface AnalyzeEmotionParams {
  data: {
    text?: string;
    audioBlob?: Blob;
    imageBlob?: Blob;
    videoBlob?: Blob;
  };
  sources?: EmotionSource[];
  scanMode?: ScanMode;
  config?: Partial<AdaptiveAnalysisConfig>;
}

interface StartSessionConfig {
  scanMode: ScanMode;
  duration: number; // minutes
  sources: EmotionSource[];
  realTimeUpdates?: boolean;
  userId?: string;
}

export const useUnifiedEmotion = (options: UseUnifiedEmotionOptions = {}): UseUnifiedEmotionReturn => {
  const {
    autoSave = true,
    realTimeUpdates = false,
    enableBiometrics = false,
    cacheResults = true,
    maxRetries = 3
  } = options;

  // État principal
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Données
  const [currentAnalysis, setCurrentAnalysis] = useState<UnifiedEmotionAnalysis | null>(null);
  const [currentSession, setCurrentSession] = useState<UnifiedScanSession | null>(null);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [insights, setInsights] = useState<EmotionInsight[]>([]);
  
  // Refs
  const retryCountRef = useRef(0);
  const sessionTimeoutRef = useRef<NodeJS.Timeout>();
  const analysisHistoryRef = useRef<UnifiedEmotionAnalysis[]>([]);

  /**
   * Analyse émotionnelle avec gestion d'erreurs robuste
   */
  const analyzeEmotion = useCallback(async (params: AnalyzeEmotionParams): Promise<UnifiedEmotionAnalysis | null> => {
    if (isAnalyzing) {
      console.warn('⚠️ Analyse déjà en cours, ignorée');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    retryCountRef.current = 0;

    const performAnalysis = async (attempt: number = 1): Promise<UnifiedEmotionAnalysis | null> => {
      try {
        console.log(`🧠 Tentative d'analyse ${attempt}/${maxRetries}...`);
        
        const analysisParams = {
          data: params.data,
          sources: params.sources || ['openai_text'],
          scanMode: params.scanMode || 'quick',
          config: {
            ...params.config,
            learningEnabled: cacheResults,
            maxProcessingTime: 30000, // 30 secondes max
          },
          sessionId: currentSession?.id
        };

        const result = await unifiedEmotionService.analyzeEmotion(analysisParams);
        
        // Mise à jour de l'état
        setCurrentAnalysis(result);
        analysisHistoryRef.current.push(result);
        
        // Génération automatique de recommandations
        if (autoSave) {
          try {
            const recs = await unifiedEmotionService.generateSmartRecommendations(result);
            setRecommendations(recs);
          } catch (recError) {
            console.warn('⚠️ Erreur génération recommandations:', recError);
            // Non bloquant
          }
        }

        toast.success(`Analyse terminée: ${result.primaryEmotion}`, {
          description: `Confiance: ${Math.round(result.overallConfidence * 100)}%`
        });

        console.log('✅ Analyse réussie:', {
          id: result.id,
          emotion: result.primaryEmotion,
          confidence: result.overallConfidence
        });

        return result;

      } catch (analysisError: any) {
        console.error(`❌ Erreur analyse (tentative ${attempt}):`, analysisError);
        
        if (attempt < maxRetries && analysisError.message !== 'User cancelled') {
          console.log(`🔄 Nouvelle tentative dans 2s...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return performAnalysis(attempt + 1);
        }
        
        throw analysisError;
      }
    };

    try {
      return await performAnalysis();
    } catch (finalError: any) {
      const errorMessage = finalError.message || 'Erreur d\'analyse émotionnelle';
      setError(errorMessage);
      
      toast.error('Analyse échouée', {
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, maxRetries, autoSave, cacheResults, currentSession?.id]);

  /**
   * Démarrage d'une session d'analyse
   */
  const startSession = useCallback(async (config: StartSessionConfig): Promise<UnifiedScanSession | null> => {
    if (isSessionActive) {
      console.warn('⚠️ Session déjà active');
      return currentSession;
    }

    setError(null);
    
    try {
      console.log('🚀 Démarrage session d\'analyse:', config);
      
      const session = await unifiedEmotionService.startScanSession({
        scanMode: config.scanMode,
        duration: config.duration,
        sources: config.sources,
        realTimeUpdates: config.realTimeUpdates || realTimeUpdates,
        userId: config.userId
      });

      setCurrentSession(session);
      setIsSessionActive(true);
      
      // Auto-arrêt après la durée prévue
      if (config.duration > 0) {
        sessionTimeoutRef.current = setTimeout(async () => {
          console.log('⏰ Durée de session atteinte, arrêt automatique');
          await endSession();
        }, config.duration * 60 * 1000);
      }

      toast.success('Session démarrée', {
        description: `Mode: ${config.scanMode}, Durée: ${config.duration}min`
      });

      return session;

    } catch (error: any) {
      const errorMessage = error.message || 'Erreur de démarrage de session';
      setError(errorMessage);
      
      toast.error('Échec démarrage session', {
        description: errorMessage
      });
      
      return null;
    }
  }, [isSessionActive, currentSession, realTimeUpdates]);

  /**
   * Arrêt d'une session
   */
  const endSession = useCallback(async (): Promise<UnifiedScanSession | null> => {
    if (!isSessionActive || !currentSession) {
      console.warn('⚠️ Aucune session active à arrêter');
      return null;
    }

    try {
      console.log('🏁 Arrêt de la session:', currentSession.id);
      
      // Nettoyage du timeout
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = undefined;
      }

      const finalSession = await unifiedEmotionService.endScanSession(currentSession.id);
      
      // Génération d'insights finaux
      try {
        const sessionInsights = await unifiedEmotionService.generateInsights(currentSession.id);
        setInsights(prev => [...prev, ...sessionInsights]);
      } catch (insightError) {
        console.warn('⚠️ Erreur génération insights:', insightError);
      }

      setIsSessionActive(false);
      
      toast.success('Session terminée', {
        description: `${finalSession.sessionMetrics?.totalAnalyses || 0} analyses effectuées`
      });

      return finalSession;

    } catch (error: any) {
      const errorMessage = error.message || 'Erreur d\'arrêt de session';
      setError(errorMessage);
      
      toast.error('Erreur arrêt session', {
        description: errorMessage
      });
      
      // Forcer l'arrêt en cas d'erreur
      setIsSessionActive(false);
      setCurrentSession(null);
      
      return null;
    }
  }, [isSessionActive, currentSession]);

  /**
   * Récupération de recommandations
   */
  const getRecommendations = useCallback(async (): Promise<SmartRecommendation[]> => {
    if (!currentAnalysis) {
      console.warn('⚠️ Aucune analyse disponible pour les recommandations');
      return [];
    }

    try {
      const recs = await unifiedEmotionService.generateSmartRecommendations(currentAnalysis);
      setRecommendations(recs);
      return recs;
    } catch (error: any) {
      console.error('❌ Erreur recommandations:', error);
      setError(`Erreur recommandations: ${error.message}`);
      return [];
    }
  }, [currentAnalysis]);

  /**
   * Génération d'insights
   */
  const generateInsights = useCallback(async (): Promise<EmotionInsight[]> => {
    if (!currentSession) {
      console.warn('⚠️ Aucune session pour générer des insights');
      return [];
    }

    try {
      const sessionInsights = await unifiedEmotionService.generateInsights(currentSession.id);
      setInsights(prev => [...prev, ...sessionInsights]);
      return sessionInsights;
    } catch (error: any) {
      console.error('❌ Erreur génération insights:', error);
      setError(`Erreur insights: ${error.message}`);
      return [];
    }
  }, [currentSession]);

  /**
   * Nettoyage des erreurs
   */
  const clearError = useCallback(() => {
    setError(null);
    retryCountRef.current = 0;
  }, []);

  /**
   * Reset complet
   */
  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setIsSessionActive(false);
    setError(null);
    setCurrentAnalysis(null);
    setCurrentSession(null);
    setRecommendations([]);
    setInsights([]);
    
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = undefined;
    }
    
    retryCountRef.current = 0;
    analysisHistoryRef.current = [];
    
    console.log('🔄 Hook emotion reset');
  }, []);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, []);

  // Log des changements d'état pour debug
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🏁 État hook emotion mis à jour:', {
        isAnalyzing,
        isSessionActive,
        hasAnalysis: !!currentAnalysis,
        hasSession: !!currentSession,
        recommendationsCount: recommendations.length,
        insightsCount: insights.length,
        error
      });
    }
  }, [isAnalyzing, isSessionActive, currentAnalysis, currentSession, recommendations.length, insights.length, error]);

  return {
    // État
    isAnalyzing,
    isSessionActive,
    error,
    
    // Données
    currentAnalysis,
    currentSession,
    recommendations,
    insights,
    
    // Actions
    analyzeEmotion,
    startSession,
    endSession,
    getRecommendations,
    generateInsights,
    clearError,
    reset
  };
};