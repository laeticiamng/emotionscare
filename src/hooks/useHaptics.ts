// @ts-nocheck
import { useCallback, useState, useEffect, useRef } from 'react';

/** Types de feedback haptique prédéfinis */
export type HapticFeedbackType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection'
  | 'impact'
  | 'notification'
  | 'heartbeat'
  | 'breathing'
  | 'celebration';

/** Configuration haptique */
export interface HapticConfig {
  enabled: boolean;
  intensity: 'low' | 'medium' | 'high';
  respectSystemSettings: boolean;
  feedbackOnTouch: boolean;
  feedbackOnSuccess: boolean;
  feedbackOnError: boolean;
}

/** État du système haptique */
export interface HapticState {
  isSupported: boolean;
  isEnabled: boolean;
  lastFeedback?: Date;
  feedbackCount: number;
}

/** Patterns haptiques prédéfinis */
const HAPTIC_PATTERNS: Record<HapticFeedbackType, number[]> = {
  light: [10],
  medium: [25],
  heavy: [50],
  success: [10, 50, 10, 50, 30],
  warning: [30, 100, 30],
  error: [50, 100, 50, 100, 50],
  selection: [5],
  impact: [15, 30],
  notification: [20, 50, 20],
  heartbeat: [100, 200, 100, 500, 100, 200, 100],
  breathing: [200, 400, 200, 400, 200, 400, 200],
  celebration: [10, 30, 10, 30, 10, 30, 50, 100, 50]
};

/** Intensités de vibration */
const INTENSITY_MULTIPLIERS: Record<string, number> = {
  low: 0.5,
  medium: 1,
  high: 1.5
};

/** Configuration par défaut */
const DEFAULT_CONFIG: HapticConfig = {
  enabled: true,
  intensity: 'medium',
  respectSystemSettings: true,
  feedbackOnTouch: true,
  feedbackOnSuccess: true,
  feedbackOnError: true
};

export const useHaptics = (initialConfig?: Partial<HapticConfig>) => {
  const [config, setConfig] = useState<HapticConfig>({ ...DEFAULT_CONFIG, ...initialConfig });
  const [state, setState] = useState<HapticState>({
    isSupported: false,
    isEnabled: true,
    feedbackCount: 0
  });
  const lastPatternRef = useRef<number[]>([]);
  const feedbackQueueRef = useRef<HapticFeedbackType[]>([]);
  const isProcessingRef = useRef(false);

  // Vérifier le support au montage
  useEffect(() => {
    const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
    setState(prev => ({ ...prev, isSupported }));

    // Charger les préférences sauvegardées
    try {
      const saved = localStorage.getItem('haptic_config');
      if (saved) {
        const savedConfig = JSON.parse(saved);
        setConfig(prev => ({ ...prev, ...savedConfig }));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Sauvegarder la configuration
  const saveConfig = useCallback((newConfig: Partial<HapticConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem('haptic_config', JSON.stringify(updated));
      } catch (e) {
        // Ignore
      }
      return updated;
    });
  }, []);

  // Vibration de base avec pattern
  const pattern = useCallback((sequence: number[]) => {
    if (!state.isSupported || !config.enabled) return false;

    try {
      const multiplier = INTENSITY_MULTIPLIERS[config.intensity] || 1;
      const adjustedSequence = sequence.map(v => Math.round(v * multiplier));

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(adjustedSequence);
        lastPatternRef.current = adjustedSequence;
        setState(prev => ({
          ...prev,
          lastFeedback: new Date(),
          feedbackCount: prev.feedbackCount + 1
        }));
        return true;
      }
    } catch (e) {
      console.warn('Haptic feedback failed:', e);
    }
    return false;
  }, [state.isSupported, config.enabled, config.intensity]);

  // Feedback par type prédéfini
  const feedback = useCallback((type: HapticFeedbackType) => {
    const feedbackPattern = HAPTIC_PATTERNS[type];
    if (feedbackPattern) {
      return pattern(feedbackPattern);
    }
    return false;
  }, [pattern]);

  // Feedback léger pour les interactions
  const lightFeedback = useCallback(() => {
    if (config.feedbackOnTouch) {
      return feedback('light');
    }
    return false;
  }, [feedback, config.feedbackOnTouch]);

  // Feedback de succès
  const successFeedback = useCallback(() => {
    if (config.feedbackOnSuccess) {
      return feedback('success');
    }
    return false;
  }, [feedback, config.feedbackOnSuccess]);

  // Feedback d'erreur
  const errorFeedback = useCallback(() => {
    if (config.feedbackOnError) {
      return feedback('error');
    }
    return false;
  }, [feedback, config.feedbackOnError]);

  // Pattern personnalisé avec répétition
  const repeatPattern = useCallback((sequence: number[], times: number) => {
    const repeatedSequence: number[] = [];
    for (let i = 0; i < times; i++) {
      repeatedSequence.push(...sequence);
      if (i < times - 1) {
        repeatedSequence.push(100); // Pause entre répétitions
      }
    }
    return pattern(repeatedSequence);
  }, [pattern]);

  // Arrêter toute vibration
  const stop = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(0);
      return true;
    }
    return false;
  }, []);

  // Vibration continue avec durée
  const vibrate = useCallback((duration: number) => {
    return pattern([duration]);
  }, [pattern]);

  // Pattern de respiration (pour exercices)
  const breathingPattern = useCallback((inhaleMs: number, holdMs: number, exhaleMs: number, cycles: number = 1) => {
    const sequence: number[] = [];
    for (let i = 0; i < cycles; i++) {
      // Inhale - vibration croissante
      sequence.push(inhaleMs / 4, 50, inhaleMs / 4, 50, inhaleMs / 4, 50, inhaleMs / 4);
      // Hold - pause
      sequence.push(holdMs);
      // Exhale - vibration décroissante
      sequence.push(exhaleMs / 4, 50, exhaleMs / 4, 50, exhaleMs / 4, 50, exhaleMs / 4);
      // Pause entre cycles
      if (i < cycles - 1) sequence.push(200);
    }
    return pattern(sequence);
  }, [pattern]);

  // Pattern de rythme cardiaque
  const heartbeatPattern = useCallback((bpm: number, beats: number = 4) => {
    const beatInterval = 60000 / bpm;
    const sequence: number[] = [];
    for (let i = 0; i < beats; i++) {
      sequence.push(80, 100, 40); // Double tap pour simuler lub-dub
      if (i < beats - 1) {
        sequence.push(beatInterval - 220);
      }
    }
    return pattern(sequence);
  }, [pattern]);

  // File d'attente pour les feedbacks
  const queueFeedback = useCallback((type: HapticFeedbackType) => {
    feedbackQueueRef.current.push(type);

    const processQueue = async () => {
      if (isProcessingRef.current || feedbackQueueRef.current.length === 0) return;

      isProcessingRef.current = true;
      while (feedbackQueueRef.current.length > 0) {
        const nextType = feedbackQueueRef.current.shift();
        if (nextType) {
          feedback(nextType);
          // Attendre que le pattern soit terminé
          const patternDuration = HAPTIC_PATTERNS[nextType].reduce((a, b) => a + b, 0);
          await new Promise(resolve => setTimeout(resolve, patternDuration + 50));
        }
      }
      isProcessingRef.current = false;
    };

    processQueue();
  }, [feedback]);

  // Activer/désactiver les haptiques
  const setEnabled = useCallback((enabled: boolean) => {
    saveConfig({ enabled });
    setState(prev => ({ ...prev, isEnabled: enabled }));
  }, [saveConfig]);

  // Changer l'intensité
  const setIntensity = useCallback((intensity: 'low' | 'medium' | 'high') => {
    saveConfig({ intensity });
  }, [saveConfig]);

  // Réinitialiser les statistiques
  const resetStats = useCallback(() => {
    setState(prev => ({
      ...prev,
      feedbackCount: 0,
      lastFeedback: undefined
    }));
  }, []);

  // Test de vibration
  const test = useCallback(() => {
    return feedback('notification');
  }, [feedback]);

  return {
    // État
    isSupported: state.isSupported,
    isEnabled: config.enabled,
    config,
    state,

    // Actions de base
    pattern,
    vibrate,
    stop,

    // Feedbacks prédéfinis
    feedback,
    lightFeedback,
    successFeedback,
    errorFeedback,

    // Patterns spéciaux
    repeatPattern,
    breathingPattern,
    heartbeatPattern,
    queueFeedback,

    // Configuration
    setEnabled,
    setIntensity,
    saveConfig,

    // Utilitaires
    test,
    resetStats,

    // Constantes exportées
    patterns: HAPTIC_PATTERNS
  };
};

export default useHaptics;
