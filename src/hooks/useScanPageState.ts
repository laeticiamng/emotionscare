/**
 * useScanPageState - État de la page de scan émotionnel
 * Gère le flux utilisateur à travers les étapes du scan
 */

import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmotionResult } from '@/types/emotion';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export type ScanStep = 'select' | 'scanning' | 'result' | 'recommendations';
export type ScanMethod = 'camera' | 'voice' | 'text' | 'sliders' | 'emoji';

interface ScanPageState {
  currentStep: ScanStep;
  selectedMethod: ScanMethod | null;
  detectedEmotion: EmotionResult | null;
  isProcessing: boolean;
  error: string | null;
  scanStartTime: Date | null;
}

const initialState: ScanPageState = {
  currentStep: 'select',
  selectedMethod: null,
  detectedEmotion: null,
  isProcessing: false,
  error: null,
  scanStartTime: null
};

export function useScanPageState() {
  const [state, setState] = useState<ScanPageState>(initialState);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sélectionner une méthode de scan
  const selectMethod = useCallback((method: ScanMethod) => {
    setState(prev => ({
      ...prev,
      selectedMethod: method,
      currentStep: 'scanning',
      scanStartTime: new Date(),
      error: null
    }));
    logger.info('[ScanPageState] Method selected', { method }, 'SCAN');
  }, []);

  // Gérer la détection d'émotion
  const handleEmotionDetected = useCallback(async (result: EmotionResult) => {
    try {
      setState(prev => ({
        ...prev,
        detectedEmotion: result,
        currentStep: 'result',
        isProcessing: false
      }));

      // Sauvegarder dans clinical_signals
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const scanDuration = state.scanStartTime
          ? Math.round((Date.now() - state.scanStartTime.getTime()) / 1000)
          : 0;

        await supabase.from('clinical_signals').insert({
          user_id: user.id,
          domain: 'emotional',
          level: Math.round((result.valence || 50) / 25), // 0-4
          source_instrument: `scan_${state.selectedMethod}`,
          window_type: 'instant',
          module_context: 'scan',
          metadata: {
            valence: result.valence,
            arousal: result.arousal,
            emotion: result.emotion,
            confidence: result.confidence,
            summary: (result as any).summary || result.emotion,
            duration_seconds: scanDuration,
            method: state.selectedMethod
          },
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
        });

        // Émettre un événement pour mettre à jour l'historique
        window.dispatchEvent(new CustomEvent('scan-saved'));
      }

      logger.info('[ScanPageState] Emotion detected and saved', { emotion: result.emotion }, 'SCAN');
    } catch (error) {
      logger.error('[ScanPageState] Error saving scan result', error, 'SCAN');
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Votre scan a été détecté mais n\'a pas pu être sauvegardé.',
        variant: 'destructive'
      });
    }
  }, [state.scanStartTime, state.selectedMethod, toast]);

  // Réinitialiser le scan
  const resetScan = useCallback(() => {
    setState(initialState);
    logger.info('[ScanPageState] Scan reset', undefined, 'SCAN');
  }, []);

  // Passer aux recommandations
  const continueToRecommendations = useCallback(() => {
    if (!state.detectedEmotion) {
      toast({
        title: 'Aucune émotion détectée',
        description: 'Effectuez d\'abord un scan pour recevoir des recommandations.',
        variant: 'destructive'
      });
      return;
    }
    setState(prev => ({ ...prev, currentStep: 'recommendations' }));
  }, [state.detectedEmotion, toast]);

  // Naviguer vers les résultats détaillés
  const navigateToResults = useCallback(() => {
    if (state.detectedEmotion) {
      navigate('/app/scan/results', { state: { emotion: state.detectedEmotion } });
    }
  }, [state.detectedEmotion, navigate]);

  // Gérer les erreurs
  const handleError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      error,
      isProcessing: false,
      currentStep: 'select'
    }));
    toast({
      title: 'Erreur de scan',
      description: error,
      variant: 'destructive'
    });
    logger.error('[ScanPageState] Scan error', { error }, 'SCAN');
  }, [toast]);

  // Définir l'état de traitement
  const setProcessing = useCallback((isProcessing: boolean) => {
    setState(prev => ({ ...prev, isProcessing }));
  }, []);

  // Aller à une étape spécifique
  const setCurrentStep = useCallback((step: ScanStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  // Helpers calculés
  const canContinue = useMemo(() => {
    return state.detectedEmotion !== null && !state.isProcessing;
  }, [state.detectedEmotion, state.isProcessing]);

  const scanDuration = useMemo(() => {
    if (!state.scanStartTime) return 0;
    return Math.round((Date.now() - state.scanStartTime.getTime()) / 1000);
  }, [state.scanStartTime]);

  return {
    // État
    ...state,
    canContinue,
    scanDuration,
    
    // Actions
    selectMethod,
    handleEmotionDetected,
    resetScan,
    continueToRecommendations,
    navigateToResults,
    handleError,
    setProcessing,
    setCurrentStep
  };
}

export default useScanPageState;
