/**
 * HOOK EMOTION ANALYSIS ENGINE - INTÉGRATION PREMIUM
 * Moteur d'analyse émotionnelle unifié pour Hume, OpenAI et analyses locales
 */

import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult, EmotionAnalysisConfig, ScanMode } from '@/types';
import { emotionsCareApi } from '@/services/emotions-care-api';
import { logger } from '@/lib/logger';

interface EmotionAnalysisState {
  isAnalyzing: boolean;
  currentResult: EmotionResult | null;
  history: EmotionResult[];
  error: string | null;
  sessionId: string | null;
}

interface AnalysisOptions {
  saveToHistory?: boolean;
  generateRecommendations?: boolean;
  triggerMusicGeneration?: boolean;
}

export const useEmotionAnalysisEngine = () => {
  const [state, setState] = useState<EmotionAnalysisState>({
    isAnalyzing: false,
    currentResult: null,
    history: [],
    error: null,
    sessionId: null
  });

  const { toast } = useToast();
  const sessionStartTime = useRef<Date | null>(null);
  const analysisCount = useRef(0);

  // === DÉMARRER UNE SESSION D'ANALYSE ===
  const startAnalysisSession = useCallback((config?: Partial<EmotionAnalysisConfig>) => {
    const sessionId = `session-${Date.now()}`;
    sessionStartTime.current = new Date();
    analysisCount.current = 0;

    setState(prev => ({
      ...prev,
      sessionId,
      error: null,
      history: []
    }));

    logger.info('Session d\'analyse démarrée', { sessionId }, 'SCAN');
    
    toast({
      title: "Session d'analyse démarrée",
      description: "Prêt à analyser vos émotions",
    });

    return sessionId;
  }, [toast]);

  // === ANALYSER ÉMOTION FACIALE ===
  const analyzeFacialEmotion = useCallback(async (
    imageData: Blob | string,
    options: AnalysisOptions = {}
  ): Promise<EmotionResult> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      logger.info('Analyse faciale en cours...', {}, 'SCAN');

      const result = await emotionsCareApi.analyzeEmotion({
        data: imageData,
        type: 'facial',
        options: {
          returnFacePredictions: true
        }
      });

      // Enrichir le résultat
      const enrichedResult: EmotionResult = {
        ...result,
        sessionId: state.sessionId ?? undefined,
        scanMode: 'facial',
        timestamp: new Date().toISOString()
      };

      analysisCount.current++;

      setState(prev => ({
        ...prev,
        currentResult: enrichedResult,
        history: options.saveToHistory !== false 
          ? [...prev.history, enrichedResult]
          : prev.history,
        isAnalyzing: false
      }));

      toast({
        title: "Analyse faciale terminée",
        description: `Émotion détectée: ${result.emotion} (${Math.round(result.confidence * 100)}%)`,
      });

      // Actions automatiques
      if (options.generateRecommendations) {
        await generateRecommendations(enrichedResult);
      }

      return enrichedResult;
    } catch (error) {
      logger.error('Erreur analyse faciale', error as Error, 'SCAN');
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      toast({
        title: "Erreur d'analyse",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    }
  }, [state.sessionId, toast]);

  // === ANALYSER ÉMOTION VOCALE ===
  const analyzeVoiceEmotion = useCallback(async (
    audioData: Blob,
    options: AnalysisOptions = {}
  ): Promise<EmotionResult> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      logger.info('🎤 Analyse vocale en cours...', {}, 'SCAN');

      const result = await emotionsCareApi.analyzeEmotion({
        data: audioData,
        type: 'voice',
        options: {
          returnVoicePredictions: true
        }
      });

      const enrichedResult: EmotionResult = {
        ...result,
        sessionId: state.sessionId ?? undefined,
        scanMode: 'voice',
        timestamp: new Date().toISOString()
      };

      analysisCount.current++;

      setState(prev => ({
        ...prev,
        currentResult: enrichedResult,
        history: options.saveToHistory !== false 
          ? [...prev.history, enrichedResult]
          : prev.history,
        isAnalyzing: false
      }));

      toast({
        title: "Analyse vocale terminée",
        description: `Émotion détectée: ${result.emotion} (${Math.round(result.confidence * 100)}%)`,
      });

      return enrichedResult;
    } catch (error) {
      logger.error('Erreur analyse vocale', error as Error, 'SCAN');
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      toast({
        title: "Erreur d'analyse",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    }
  }, [state.sessionId, toast]);

  // === ANALYSER ÉMOTION TEXTUELLE ===
  const analyzeTextEmotion = useCallback(async (
    text: string,
    options: AnalysisOptions = {}
  ): Promise<EmotionResult> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      logger.info('Analyse textuelle en cours...', {}, 'SCAN');

      const result = await emotionsCareApi.analyzeText({
        text,
        type: 'emotion',
        context: {
          sessionId: state.sessionId,
          analysisCount: analysisCount.current
        }
      });

      // Transformer la réponse OpenAI en EmotionResult
      const emotionResult: EmotionResult = {
        id: `text-${Date.now()}`,
        timestamp: new Date().toISOString(),
        emotion: result.emotion || 'neutral',
        confidence: result.confidence || 0.5,
        intensity: result.intensity || 0.5,
        source: 'text_analysis',
        scanMode: 'text',
        sessionId: state.sessionId ?? undefined,
        text,
        recommendations: result.recommendations
      };

      analysisCount.current++;

      setState(prev => ({
        ...prev,
        currentResult: emotionResult,
        history: options.saveToHistory !== false 
          ? [...prev.history, emotionResult]
          : prev.history,
        isAnalyzing: false
      }));

      toast({
        title: "Analyse textuelle terminée",
        description: `Émotion détectée: ${emotionResult.emotion}`,
      });

      return emotionResult;
    } catch (error) {
      logger.error('Erreur analyse textuelle', error as Error, 'SCAN');
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      toast({
        title: "Erreur d'analyse",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    }
  }, [state.sessionId, toast]);

  // === ANALYSE MULTIMODALE ===
  const analyzeMultimodal = useCallback(async (
    data: {
      image?: Blob | string;
      audio?: Blob;
      text?: string;
    },
    options: AnalysisOptions = {}
  ): Promise<EmotionResult> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      logger.info('Analyse multimodale en cours...', {}, 'SCAN');

      const results: EmotionResult[] = [];

      // Analyser chaque modalité disponible
      if (data.image) {
        const imageResult = await analyzeFacialEmotion(data.image, { saveToHistory: false });
        results.push(imageResult);
      }

      if (data.audio) {
        const audioResult = await analyzeVoiceEmotion(data.audio, { saveToHistory: false });
        results.push(audioResult);
      }

      if (data.text) {
        const textResult = await analyzeTextEmotion(data.text, { saveToHistory: false });
        results.push(textResult);
      }

      // Fusionner les résultats
      const combinedResult = combineEmotionResults(results);

      setState(prev => ({
        ...prev,
        currentResult: combinedResult,
        history: options.saveToHistory !== false 
          ? [...prev.history, combinedResult]
          : prev.history,
        isAnalyzing: false
      }));

      toast({
        title: "Analyse multimodale terminée",
        description: `Émotion finale: ${combinedResult.emotion} (fusion de ${results.length} analyses)`,
      });

      return combinedResult;
    } catch (error) {
      logger.error('Erreur analyse multimodale', error as Error, 'SCAN');
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }));

      throw error;
    }
  }, [analyzeFacialEmotion, analyzeVoiceEmotion, analyzeTextEmotion, toast]);

  // === GÉNÉRER RECOMMANDATIONS ===
  const generateRecommendations = useCallback(async (result: EmotionResult) => {
    try {
      const recommendations = await emotionsCareApi.analyzeText({
        text: `Génère 3 recommendations de bien-être pour une personne qui ressent: ${result.emotion} avec une intensité de ${result.intensity}`,
        type: 'recommendation'
      });

      setState(prev => ({
        ...prev,
        currentResult: prev.currentResult ? {
          ...prev.currentResult,
          recommendations: recommendations.recommendations || []
        } : null
      }));
    } catch (error) {
      logger.error('Erreur génération recommandations', error as Error, 'SCAN');
    }
  }, []);

  // === TERMINER LA SESSION ===
  const endAnalysisSession = useCallback(() => {
    if (!sessionStartTime.current) return null;

    const sessionDuration = Date.now() - sessionStartTime.current.getTime();
    const sessionSummary = {
      sessionId: state.sessionId,
      duration: sessionDuration,
      analysisCount: analysisCount.current,
      results: state.history,
      averageConfidence: state.history.reduce((acc, r) => 
        acc + (typeof r.confidence === 'number' ? r.confidence : 0.5), 0
      ) / (state.history.length || 1)
    };

    setState(prev => ({
      ...prev,
      sessionId: null
    }));

    sessionStartTime.current = null;
    analysisCount.current = 0;

    logger.info('Session terminée', { sessionSummary }, 'SCAN');

    toast({
      title: "Session terminée",
      description: `${analysisCount.current} analyses effectuées`,
    });

    return sessionSummary;
  }, [state.sessionId, state.history, toast]);

  // === UTILITAIRES ===
  const combineEmotionResults = (results: EmotionResult[]): EmotionResult => {
    if (results.length === 0) {
      throw new Error('Aucun résultat à fusionner');
    }

    if (results.length === 1) {
      return results[0];
    }

    // Calculer la confiance moyenne pondérée
    const totalConfidence = results.reduce((acc, r) => 
      acc + (typeof r.confidence === 'number' ? r.confidence : 0.5), 0
    );
    const averageConfidence = totalConfidence / results.length;

    // Prendre l'émotion avec la plus haute confiance
    const bestResult = results.reduce((best, current) => {
      const bestConf = typeof best.confidence === 'number' ? best.confidence : 0.5;
      const currentConf = typeof current.confidence === 'number' ? current.confidence : 0.5;
      return currentConf > bestConf ? current : best;
    });

    return {
      id: `multimodal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      emotion: bestResult.emotion,
      confidence: averageConfidence,
      intensity: results.reduce((acc, r) => acc + r.intensity, 0) / results.length,
      source: 'multimodal',
      scanMode: 'combined',
      sessionId: state.sessionId ?? undefined,
      details: {
        modalityResults: results,
        fusionMethod: 'weighted_confidence'
      }
    };
  };

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [],
      currentResult: null,
      error: null
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // État
    ...state,
    isSessionActive: !!state.sessionId,
    analysisCount: analysisCount.current,
    
    // Actions d'analyse
    startAnalysisSession,
    endAnalysisSession,
    analyzeFacialEmotion,
    analyzeVoiceEmotion, 
    analyzeTextEmotion,
    analyzeMultimodal,
    
    // Actions utilitaires
    generateRecommendations,
    clearHistory,
    clearError
  };
};