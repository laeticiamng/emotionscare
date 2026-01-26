/**
 * Hook React pour utiliser le service unifié d'analyse émotionnelle
 *
 * @module useUnifiedEmotionAnalysis
 * @version 1.0.0
 * @created 2025-11-14
 */

import { useState, useCallback } from 'react';
import {
  EmotionAnalysisService,
  EmotionAnalysisResult,
  TextAnalysisInput,
  VoiceAnalysisInput,
  CameraAnalysisInput,
  EmojiAnalysisInput,
} from '@/services/unified/EmotionAnalysisService';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export interface UseUnifiedEmotionAnalysisReturn {
  // État
  isAnalyzing: boolean;
  result: EmotionAnalysisResult | null;
  error: Error | null;

  // Méthodes d'analyse
  analyzeText: (input: TextAnalysisInput) => Promise<EmotionAnalysisResult | null>;
  analyzeVoice: (input: VoiceAnalysisInput) => Promise<EmotionAnalysisResult | null>;
  analyzeCamera: (input: CameraAnalysisInput) => Promise<EmotionAnalysisResult | null>;
  analyzeEmoji: (input: EmojiAnalysisInput) => Promise<EmotionAnalysisResult | null>;
  analyzeMultiModal: (input: {
    text?: string;
    audio?: Blob | string;
    emojis?: string[];
  }) => Promise<EmotionAnalysisResult | null>;

  // Utilitaires
  reset: () => void;
  formatForDisplay: (result?: EmotionAnalysisResult) => ReturnType<typeof EmotionAnalysisService.formatForDisplay> | null;
  calculateScore: (result?: EmotionAnalysisResult) => number | null;
}

export interface UseUnifiedEmotionAnalysisOptions {
  /**
   * Afficher les toasts en cas d'erreur
   * @default true
   */
  showErrorToast?: boolean;

  /**
   * Afficher les toasts en cas de succès
   * @default false
   */
  showSuccessToast?: boolean;

  /**
   * Callback appelé après une analyse réussie
   */
  onSuccess?: (result: EmotionAnalysisResult) => void;

  /**
   * Callback appelé en cas d'erreur
   */
  onError?: (error: Error) => void;

  /**
   * Sauvegarder automatiquement les résultats dans Supabase
   * @default false
   */
  autoSave?: boolean;
}

/**
 * Hook pour utiliser le service unifié d'analyse émotionnelle
 *
 * @example
 * ```tsx
 * const { analyzeText, result, isAnalyzing } = useUnifiedEmotionAnalysis({
 *   showSuccessToast: true,
 *   onSuccess: (result) => logger.debug('Analysé:', result, 'HOOK');
 *
 * const handleAnalyze = async () => {
 *   await analyzeText({ text: 'Je suis très heureux aujourd\'hui!' });
 * };
 * ```
 */
export function useUnifiedEmotionAnalysis(
  options: UseUnifiedEmotionAnalysisOptions = {}
): UseUnifiedEmotionAnalysisReturn {
  const {
    showErrorToast = true,
    showSuccessToast = false,
    onSuccess,
    onError,
  } = options;

  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionAnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Wrapper générique pour les analyses
   */
  const performAnalysis = useCallback(
    async (
      analysisFn: () => Promise<EmotionAnalysisResult>
    ): Promise<EmotionAnalysisResult | null> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        const analysisResult = await analysisFn();

        setResult(analysisResult);

        // Callbacks
        onSuccess?.(analysisResult);

        // Toast de succès
        if (showSuccessToast) {
          toast({
            title: '✅ Analyse terminée',
            description: `Émotion dominante: ${analysisResult.dominant_emotion}`,
          });
        }

        logger.info('Emotion analysis success', {
          emotion: analysisResult.dominant_emotion,
          source: analysisResult.metadata?.source
        }, 'EMOTION_HOOK');

        return analysisResult;
      } catch (err) {
        const analysisError = err as Error;
        setError(analysisError);

        // Callbacks
        onError?.(analysisError);

        // Toast d'erreur
        if (showErrorToast) {
          toast({
            title: '❌ Erreur d\'analyse',
            description: analysisError.message,
            variant: 'destructive',
          });
        }

        logger.error('Emotion analysis error', analysisError, 'EMOTION_HOOK');

        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [showErrorToast, showSuccessToast, onSuccess, onError, toast]
  );

  /**
   * Analyse de texte
   */
  const analyzeText = useCallback(
    async (input: TextAnalysisInput) => {
      return performAnalysis(
        () => EmotionAnalysisService.analyzeText(input)
      );
    },
    [performAnalysis]
  );

  /**
   * Analyse vocale
   */
  const analyzeVoice = useCallback(
    async (input: VoiceAnalysisInput) => {
      return performAnalysis(
        () => EmotionAnalysisService.analyzeVoice(input)
      );
    },
    [performAnalysis]
  );

  /**
   * Analyse caméra/facial
   */
  const analyzeCamera = useCallback(
    async (input: CameraAnalysisInput) => {
      return performAnalysis(
        () => EmotionAnalysisService.analyzeCamera(input)
      );
    },
    [performAnalysis]
  );

  /**
   * Analyse emoji
   */
  const analyzeEmoji = useCallback(
    async (input: EmojiAnalysisInput) => {
      return performAnalysis(
        () => EmotionAnalysisService.analyzeEmoji(input)
      );
    },
    [performAnalysis]
  );

  /**
   * Analyse multi-modale
   */
  const analyzeMultiModal = useCallback(
    async (input: { text?: string; audio?: Blob | string; emojis?: string[] }) => {
      return performAnalysis(
        () => EmotionAnalysisService.analyzeMultiModal(input)
      );
    },
    [performAnalysis]
  );

  /**
   * Réinitialise l'état
   */
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  /**
   * Formate le résultat pour l'affichage
   */
  const formatForDisplay = useCallback(
    (resultToFormat?: EmotionAnalysisResult) => {
      const targetResult = resultToFormat || result;
      if (!targetResult) return null;
      return EmotionAnalysisService.formatForDisplay(targetResult);
    },
    [result]
  );

  /**
   * Calcule le score émotionnel (0-100)
   */
  const calculateScore = useCallback(
    (resultToCalculate?: EmotionAnalysisResult) => {
      const targetResult = resultToCalculate || result;
      if (!targetResult) return null;
      return EmotionAnalysisService.calculateEmotionalScore(targetResult);
    },
    [result]
  );

  return {
    // État
    isAnalyzing,
    result,
    error,

    // Méthodes
    analyzeText,
    analyzeVoice,
    analyzeCamera,
    analyzeEmoji,
    analyzeMultiModal,

    // Utilitaires
    reset,
    formatForDisplay,
    calculateScore,
  };
}

/**
 * Hook simplifié pour analyse texte uniquement
 */
export function useTextEmotionAnalysis(options?: UseUnifiedEmotionAnalysisOptions) {
  const { analyzeText, ...rest } = useUnifiedEmotionAnalysis(options);
  return { analyze: analyzeText, ...rest };
}

/**
 * Hook simplifié pour analyse vocale uniquement
 */
export function useVoiceEmotionAnalysis(options?: UseUnifiedEmotionAnalysisOptions) {
  const { analyzeVoice, ...rest } = useUnifiedEmotionAnalysis(options);
  return { analyze: analyzeVoice, ...rest };
}

/**
 * Hook simplifié pour analyse caméra uniquement
 */
export function useCameraEmotionAnalysis(options?: UseUnifiedEmotionAnalysisOptions) {
  const { analyzeCamera, ...rest } = useUnifiedEmotionAnalysis(options);
  return { analyze: analyzeCamera, ...rest };
}
