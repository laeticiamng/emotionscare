/**
 * useHaptics - Hook avancé pour les retours haptiques
 * Synchronisé avec les exercices de respiration et patterns thérapeutiques
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { logger } from '@/lib/logger';
import { useUserPreference } from '@/hooks/useSupabaseStorage';

export type HapticIntensity = 'light' | 'medium' | 'heavy';
export type HapticPattern = 
  | 'tap' | 'double-tap' | 'success' | 'error' | 'warning' | 'notification' 
  | 'heartbeat' | 'breathing' | 'inhale' | 'exhale' | 'hold' | 'box-breathing' 
  | 'coherence' | 'calm-wave' | 'energy-boost' | 'focus' | 'sleep';

interface HapticConfig {
  enabled: boolean;
  intensity: HapticIntensity;
  syncWithBreathing: boolean;
  reducedMotion: boolean;
}

// Patterns de vibration prédéfinis (en ms)
const PATTERNS: Record<HapticPattern, Record<HapticIntensity, number[]>> = {
  tap: {
    light: [10],
    medium: [20],
    heavy: [35],
  },
  'double-tap': {
    light: [10, 50, 10],
    medium: [20, 80, 20],
    heavy: [35, 100, 35],
  },
  success: {
    light: [10, 50, 10, 50, 15],
    medium: [20, 80, 20, 80, 30],
    heavy: [35, 100, 35, 100, 50],
  },
  error: {
    light: [50, 30, 50, 30, 50],
    medium: [80, 50, 80, 50, 80],
    heavy: [120, 80, 120, 80, 120],
  },
  warning: {
    light: [30, 100, 30],
    medium: [50, 150, 50],
    heavy: [80, 200, 80],
  },
  notification: {
    light: [10, 50, 10, 100, 20],
    medium: [20, 80, 20, 150, 40],
    heavy: [35, 120, 35, 200, 60],
  },
  heartbeat: {
    light: [20, 100, 20, 300],
    medium: [30, 150, 30, 400],
    heavy: [50, 200, 50, 500],
  },
  breathing: {
    light: [10, 50, 15, 100, 20, 150, 25, 200, 20, 150, 15, 100, 10],
    medium: [15, 80, 25, 150, 35, 220, 45, 300, 35, 220, 25, 150, 15],
    heavy: [25, 120, 40, 220, 55, 320, 70, 450, 55, 320, 40, 220, 25],
  },
  // Nouveaux patterns pour respiration synchronisée
  inhale: {
    light: [10, 100, 15, 150, 20, 200, 25, 250, 30],
    medium: [15, 150, 25, 200, 35, 250, 45, 300, 50],
    heavy: [25, 200, 40, 280, 55, 350, 70, 420, 80],
  },
  exhale: {
    light: [30, 250, 25, 200, 20, 150, 15, 100, 10],
    medium: [50, 300, 45, 250, 35, 200, 25, 150, 15],
    heavy: [80, 420, 70, 350, 55, 280, 40, 200, 25],
  },
  hold: {
    light: [5, 500],
    medium: [10, 500],
    heavy: [15, 500],
  },
  'box-breathing': {
    light: [10, 100, 15, 100, 20, 100, 15, 100, 10, 400, 10, 100, 15, 100, 20, 100, 15, 100, 10, 400],
    medium: [15, 150, 25, 150, 35, 150, 25, 150, 15, 600, 15, 150, 25, 150, 35, 150, 25, 150, 15, 600],
    heavy: [25, 200, 40, 200, 55, 200, 40, 200, 25, 800, 25, 200, 40, 200, 55, 200, 40, 200, 25, 800],
  },
  coherence: {
    light: [10, 80, 15, 120, 20, 160, 25, 200, 30, 240, 25, 200, 20, 160, 15, 120, 10],
    medium: [15, 120, 25, 180, 35, 240, 45, 300, 50, 360, 45, 300, 35, 240, 25, 180, 15],
    heavy: [25, 160, 40, 240, 55, 320, 70, 400, 85, 480, 70, 400, 55, 320, 40, 240, 25],
  },
  'calm-wave': {
    light: [5, 200, 10, 300, 15, 400, 10, 300, 5],
    medium: [10, 300, 20, 450, 30, 600, 20, 450, 10],
    heavy: [15, 400, 30, 600, 50, 800, 30, 600, 15],
  },
  'energy-boost': {
    light: [20, 50, 20, 50, 20, 50, 20, 100, 30, 30, 30, 30, 30],
    medium: [35, 70, 35, 70, 35, 70, 35, 140, 50, 50, 50, 50, 50],
    heavy: [50, 100, 50, 100, 50, 100, 50, 200, 70, 70, 70, 70, 70],
  },
  focus: {
    light: [15, 150, 15, 150, 15, 500],
    medium: [25, 200, 25, 200, 25, 700],
    heavy: [40, 280, 40, 280, 40, 1000],
  },
  sleep: {
    light: [5, 300, 8, 400, 10, 500, 8, 600, 5, 700],
    medium: [10, 450, 15, 600, 20, 750, 15, 900, 10, 1050],
    heavy: [15, 600, 25, 800, 35, 1000, 25, 1200, 15, 1400],
  },
};

// Mapping des phases de respiration vers les patterns
const BREATHING_PHASE_PATTERNS: Record<string, HapticPattern> = {
  inhale: 'inhale',
  hold_in: 'hold',
  exhale: 'exhale',
  hold_out: 'hold',
  rest: 'calm-wave',
};

export const useHaptics = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [config, setConfigState] = useUserPreference<HapticConfig>('haptic_preferences', {
    enabled: true,
    intensity: 'medium',
    syncWithBreathing: true,
    reducedMotion: false,
  });
  const breathingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Vérifier le support au montage
  useEffect(() => {
    const supported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
    setIsSupported(supported);
    if (!supported) {
      logger.debug('Haptic feedback not supported on this device', undefined, 'HAPTICS');
    }
  }, []);

  // Nettoyer l'intervalle de respiration au démontage
  useEffect(() => {
    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
    };
  }, []);

  /**
   * Exécute un pattern de vibration personnalisé
   */
  const pattern = useCallback((sequence: number[]) => {
    if (!isSupported || !config.enabled) return false;
    try {
      return navigator.vibrate(sequence);
    } catch (err) {
      logger.warn('Haptic vibration failed', err, 'HAPTICS');
      return false;
    }
  }, [isSupported, config.enabled]);

  /**
   * Exécute un pattern prédéfini
   */
  const trigger = useCallback((patternName: HapticPattern, intensity?: HapticIntensity) => {
    if (!isSupported || !config.enabled) return false;
    
    const actualIntensity = intensity || config.intensity;
    const sequence = PATTERNS[patternName]?.[actualIntensity];
    
    if (!sequence) {
      logger.warn('Unknown haptic pattern', { patternName, intensity: actualIntensity }, 'HAPTICS');
      return false;
    }

    try {
      return navigator.vibrate(sequence);
    } catch (err) {
      logger.warn('Haptic trigger failed', err, 'HAPTICS');
      return false;
    }
  }, [isSupported, config]);

  /**
   * Tap simple
   */
  const tap = useCallback(() => trigger('tap'), [trigger]);

  /**
   * Double tap
   */
  const doubleTap = useCallback(() => trigger('double-tap'), [trigger]);

  /**
   * Feedback de succès
   */
  const success = useCallback(() => trigger('success'), [trigger]);

  /**
   * Feedback d'erreur
   */
  const error = useCallback(() => trigger('error'), [trigger]);

  /**
   * Feedback d'avertissement
   */
  const warning = useCallback(() => trigger('warning'), [trigger]);

  /**
   * Notification
   */
  const notification = useCallback(() => trigger('notification'), [trigger]);

  /**
   * Heartbeat (pour méditation, etc.)
   */
  const heartbeat = useCallback(() => trigger('heartbeat'), [trigger]);

  /**
   * Pattern respiratoire
   */
  const breathing = useCallback(() => trigger('breathing'), [trigger]);

  /**
   * Arrête toute vibration en cours
   */
  const stop = useCallback(() => {
    if (isSupported) {
      navigator.vibrate(0);
    }
  }, [isSupported]);

  /**
   * Active/désactive les haptics
   */
  const setEnabled = useCallback(async (enabled: boolean) => {
    await setConfigState({ ...config, enabled });
    if (!enabled) stop();
  }, [stop, config, setConfigState]);

  /**
   * Change l'intensité par défaut
   */
  const setIntensity = useCallback(async (intensity: HapticIntensity) => {
    await setConfigState({ ...config, intensity });
  }, [config, setConfigState]);

  /**
   * Synchronise les haptics avec une phase de respiration
   */
  const triggerBreathingPhase = useCallback((phase: string) => {
    if (!config.syncWithBreathing) return false;
    const patternName = BREATHING_PHASE_PATTERNS[phase] || 'breathing';
    return trigger(patternName as HapticPattern);
  }, [config.syncWithBreathing, trigger]);

  /**
   * Démarre une session de respiration synchronisée
   */
  const startBreathingSession = useCallback((
    pattern: 'box-breathing' | 'coherence' | '4-7-8',
    bpm: number = 6
  ) => {
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
    }

    const cycleMs = (60 / bpm) * 1000;
    
    // Déclencher immédiatement
    trigger(pattern === 'box-breathing' ? 'box-breathing' : 'coherence');

    // Puis répéter
    breathingIntervalRef.current = setInterval(() => {
      trigger(pattern === 'box-breathing' ? 'box-breathing' : 'coherence');
    }, cycleMs);

    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
        breathingIntervalRef.current = null;
      }
    };
  }, [trigger]);

  /**
   * Arrête la session de respiration synchronisée
   */
  const stopBreathingSession = useCallback(() => {
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = null;
    }
    stop();
  }, [stop]);

  return {
    // État
    isSupported,
    isEnabled: config.enabled,
    intensity: config.intensity,
    syncWithBreathing: config.syncWithBreathing,
    
    // Actions de base
    pattern,
    trigger,
    stop,
    
    // Patterns prédéfinis
    tap,
    doubleTap,
    success,
    error,
    warning,
    notification,
    heartbeat,
    breathing,
    
    // Respiration synchronisée
    triggerBreathingPhase,
    startBreathingSession,
    stopBreathingSession,
    
    // Configuration
    setEnabled,
    setIntensity,
  };
};

export default useHaptics;
