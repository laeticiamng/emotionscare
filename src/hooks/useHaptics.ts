/**
 * useHaptics - Hook avancé pour les retours haptiques
 * Fournit une API riche pour différents patterns de vibration
 */

import { useCallback, useEffect, useState } from 'react';
import { logger } from '@/lib/logger';

export type HapticIntensity = 'light' | 'medium' | 'heavy';
export type HapticPattern = 'tap' | 'double-tap' | 'success' | 'error' | 'warning' | 'notification' | 'heartbeat' | 'breathing';

interface HapticConfig {
  enabled: boolean;
  intensity: HapticIntensity;
}

const STORAGE_KEY = 'haptic_preferences';

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
};

export const useHaptics = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [config, setConfig] = useState<HapticConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { enabled: true, intensity: 'medium' };
  });

  // Vérifier le support au montage
  useEffect(() => {
    const supported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
    setIsSupported(supported);
    if (!supported) {
      logger.debug('Haptic feedback not supported on this device', undefined, 'HAPTICS');
    }
  }, []);

  // Sauvegarder les préférences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

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
  const setEnabled = useCallback((enabled: boolean) => {
    setConfig(prev => ({ ...prev, enabled }));
    if (!enabled) stop();
  }, [stop]);

  /**
   * Change l'intensité par défaut
   */
  const setIntensity = useCallback((intensity: HapticIntensity) => {
    setConfig(prev => ({ ...prev, intensity }));
  }, []);

  return {
    // État
    isSupported,
    isEnabled: config.enabled,
    intensity: config.intensity,
    
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
    
    // Configuration
    setEnabled,
    setIntensity,
  };
};

export default useHaptics;
