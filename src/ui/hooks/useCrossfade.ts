// @ts-nocheck
"use client";
/**
 * useCrossfade - Hook de fondu enchaîné audio
 * Gestion des transitions audio fluides entre pistes
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { crossfadeVolumes } from "@/lib/audio/utils";

/** Type de courbe de fondu */
export type FadeCurve = 'linear' | 'exponential' | 'logarithmic' | 'cosine' | 'equal_power';

/** Configuration du crossfade */
export interface CrossfadeConfig {
  defaultDuration: number;
  defaultCurve: FadeCurve;
  minVolume: number;
  maxVolume: number;
  stepInterval: number;
  autoStart: boolean;
  syncMode: 'time' | 'beat' | 'manual';
  overlapRatio: number;
}

/** État du crossfade */
export interface CrossfadeState {
  isActive: boolean;
  progress: number;
  sourceVolume: number;
  targetVolume: number;
  sourceName: string | null;
  targetName: string | null;
  startTime: number | null;
  estimatedEndTime: number | null;
  curve: FadeCurve;
}

/** Point de transition */
export interface TransitionPoint {
  timestamp: number;
  sourceVolume: number;
  targetVolume: number;
  progress: number;
}

/** Statistiques du crossfade */
export interface CrossfadeStats {
  totalTransitions: number;
  averageDuration: number;
  completedTransitions: number;
  cancelledTransitions: number;
  lastTransitionDuration: number | null;
  transitionHistory: TransitionRecord[];
}

/** Enregistrement de transition */
export interface TransitionRecord {
  id: string;
  startTime: number;
  endTime: number | null;
  sourceName: string;
  targetName: string;
  duration: number;
  curve: FadeCurve;
  completed: boolean;
  cancelled: boolean;
}

/** Options de transition */
export interface TransitionOptions {
  duration?: number;
  curve?: FadeCurve;
  delay?: number;
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

/** Résultat du hook */
export interface CrossfadeResult {
  // Fonction originale
  crossfadeVolumes: typeof crossfadeVolumes;

  // État
  state: CrossfadeState;
  isTransitioning: boolean;
  progress: number;

  // Actions
  startTransition: (source: string, target: string, options?: TransitionOptions) => void;
  cancelTransition: () => void;
  pauseTransition: () => void;
  resumeTransition: () => void;
  seekTransition: (progress: number) => void;

  // Calculs de volume
  calculateVolumes: (progress: number, curve?: FadeCurve) => { source: number; target: number };
  getVolumeAtProgress: (progress: number, isSource: boolean, curve?: FadeCurve) => number;

  // Utilitaires
  getStats: () => CrossfadeStats;
  getHistory: () => TransitionRecord[];
  clearHistory: () => void;
  configure: (config: Partial<CrossfadeConfig>) => void;

  // Courbes disponibles
  availableCurves: FadeCurve[];
}

// Configuration par défaut
const DEFAULT_CONFIG: CrossfadeConfig = {
  defaultDuration: 3000,
  defaultCurve: 'equal_power',
  minVolume: 0,
  maxVolume: 1,
  stepInterval: 16,
  autoStart: true,
  syncMode: 'time',
  overlapRatio: 0.5
};

/** Calculer le volume selon la courbe */
function calculateVolumeForCurve(
  progress: number,
  curve: FadeCurve,
  isSource: boolean
): number {
  // Inverser la progression pour la source (fade out)
  const p = isSource ? 1 - progress : progress;

  switch (curve) {
    case 'linear':
      return p;

    case 'exponential':
      return Math.pow(p, 2);

    case 'logarithmic':
      return p === 0 ? 0 : 1 + Math.log10(p);

    case 'cosine':
      return (1 - Math.cos(p * Math.PI)) / 2;

    case 'equal_power':
      // Crossfade à puissance égale (conserve l'énergie totale)
      return isSource
        ? Math.cos(progress * Math.PI / 2)
        : Math.sin(progress * Math.PI / 2);

    default:
      return p;
  }
}

/** Générer un ID unique */
function generateId(): string {
  return `transition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Hook de crossfade audio
 */
export function useCrossfade(
  initialConfig?: Partial<CrossfadeConfig>
): CrossfadeResult {
  // Configuration
  const configRef = useRef<CrossfadeConfig>({ ...DEFAULT_CONFIG, ...initialConfig });

  // État
  const [state, setState] = useState<CrossfadeState>({
    isActive: false,
    progress: 0,
    sourceVolume: 1,
    targetVolume: 0,
    sourceName: null,
    targetName: null,
    startTime: null,
    estimatedEndTime: null,
    curve: configRef.current.defaultCurve
  });

  // Refs pour l'animation
  const animationRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const pauseTimeRef = useRef<number | null>(null);
  const currentOptionsRef = useRef<TransitionOptions | null>(null);

  // Statistiques
  const statsRef = useRef<CrossfadeStats>({
    totalTransitions: 0,
    averageDuration: 0,
    completedTransitions: 0,
    cancelledTransitions: 0,
    lastTransitionDuration: null,
    transitionHistory: []
  });

  // Enregistrement actuel
  const currentRecordRef = useRef<TransitionRecord | null>(null);

  /** Nettoyer l'animation */
  const cleanupAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  /** Calculer les volumes */
  const calculateVolumes = useCallback((
    progress: number,
    curve: FadeCurve = configRef.current.defaultCurve
  ): { source: number; target: number } => {
    const sourceVol = calculateVolumeForCurve(progress, curve, true);
    const targetVol = calculateVolumeForCurve(progress, curve, false);

    // Appliquer les limites
    const { minVolume, maxVolume } = configRef.current;

    return {
      source: Math.max(minVolume, Math.min(maxVolume, sourceVol)),
      target: Math.max(minVolume, Math.min(maxVolume, targetVol))
    };
  }, []);

  /** Obtenir le volume à une progression donnée */
  const getVolumeAtProgress = useCallback((
    progress: number,
    isSource: boolean,
    curve: FadeCurve = configRef.current.defaultCurve
  ): number => {
    return calculateVolumeForCurve(progress, curve, isSource);
  }, []);

  /** Boucle d'animation */
  const animationLoop = useCallback((
    startTime: number,
    duration: number,
    curve: FadeCurve,
    options: TransitionOptions
  ) => {
    const tick = (currentTime: number) => {
      if (pausedRef.current) {
        animationRef.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      const volumes = calculateVolumes(progress, curve);

      setState(prev => ({
        ...prev,
        progress,
        sourceVolume: volumes.source,
        targetVolume: volumes.target
      }));

      // Callback de progression
      options.onProgress?.(progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        // Transition terminée
        const endTime = Date.now();

        if (currentRecordRef.current) {
          currentRecordRef.current.endTime = endTime;
          currentRecordRef.current.completed = true;

          // Mettre à jour les stats
          statsRef.current.completedTransitions++;
          statsRef.current.lastTransitionDuration = endTime - (currentRecordRef.current.startTime || 0);

          // Calculer la moyenne
          const completedRecords = statsRef.current.transitionHistory.filter(r => r.completed);
          if (completedRecords.length > 0) {
            const totalDuration = completedRecords.reduce(
              (sum, r) => sum + (r.endTime! - r.startTime),
              0
            );
            statsRef.current.averageDuration = totalDuration / completedRecords.length;
          }
        }

        setState(prev => ({
          ...prev,
          isActive: false,
          progress: 1,
          sourceVolume: 0,
          targetVolume: 1
        }));

        options.onComplete?.();
        currentOptionsRef.current = null;
        currentRecordRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(tick);
  }, [calculateVolumes]);

  /** Démarrer une transition */
  const startTransition = useCallback((
    source: string,
    target: string,
    options: TransitionOptions = {}
  ) => {
    // Annuler toute transition en cours
    cleanupAnimation();

    const duration = options.duration ?? configRef.current.defaultDuration;
    const curve = options.curve ?? configRef.current.defaultCurve;
    const delay = options.delay ?? 0;

    const startTransitionNow = () => {
      const startTime = performance.now();
      const actualStartTime = Date.now();

      // Créer l'enregistrement
      const record: TransitionRecord = {
        id: generateId(),
        startTime: actualStartTime,
        endTime: null,
        sourceName: source,
        targetName: target,
        duration,
        curve,
        completed: false,
        cancelled: false
      };

      currentRecordRef.current = record;
      statsRef.current.transitionHistory.push(record);
      statsRef.current.totalTransitions++;

      // Mettre à jour l'état
      setState({
        isActive: true,
        progress: 0,
        sourceVolume: 1,
        targetVolume: 0,
        sourceName: source,
        targetName: target,
        startTime: actualStartTime,
        estimatedEndTime: actualStartTime + duration,
        curve
      });

      currentOptionsRef.current = options;
      pausedRef.current = false;

      options.onStart?.();

      // Démarrer l'animation
      animationLoop(startTime, duration, curve, options);
    };

    if (delay > 0) {
      setTimeout(startTransitionNow, delay);
    } else {
      startTransitionNow();
    }
  }, [cleanupAnimation, animationLoop]);

  /** Annuler la transition */
  const cancelTransition = useCallback(() => {
    cleanupAnimation();

    if (currentRecordRef.current) {
      currentRecordRef.current.endTime = Date.now();
      currentRecordRef.current.cancelled = true;
      statsRef.current.cancelledTransitions++;
    }

    currentOptionsRef.current?.onCancel?.();

    setState(prev => ({
      ...prev,
      isActive: false,
      progress: 0
    }));

    currentOptionsRef.current = null;
    currentRecordRef.current = null;
  }, [cleanupAnimation]);

  /** Mettre en pause */
  const pauseTransition = useCallback(() => {
    if (state.isActive && !pausedRef.current) {
      pausedRef.current = true;
      pauseTimeRef.current = performance.now();
    }
  }, [state.isActive]);

  /** Reprendre */
  const resumeTransition = useCallback(() => {
    if (state.isActive && pausedRef.current) {
      pausedRef.current = false;
      pauseTimeRef.current = null;
    }
  }, [state.isActive]);

  /** Aller à une position */
  const seekTransition = useCallback((progress: number) => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const volumes = calculateVolumes(clampedProgress, state.curve);

    setState(prev => ({
      ...prev,
      progress: clampedProgress,
      sourceVolume: volumes.source,
      targetVolume: volumes.target
    }));

    currentOptionsRef.current?.onProgress?.(clampedProgress);
  }, [calculateVolumes, state.curve]);

  /** Obtenir les statistiques */
  const getStats = useCallback((): CrossfadeStats => {
    return { ...statsRef.current };
  }, []);

  /** Obtenir l'historique */
  const getHistory = useCallback((): TransitionRecord[] => {
    return [...statsRef.current.transitionHistory];
  }, []);

  /** Effacer l'historique */
  const clearHistory = useCallback(() => {
    statsRef.current = {
      totalTransitions: 0,
      averageDuration: 0,
      completedTransitions: 0,
      cancelledTransitions: 0,
      lastTransitionDuration: null,
      transitionHistory: []
    };
  }, []);

  /** Configurer */
  const configure = useCallback((config: Partial<CrossfadeConfig>) => {
    configRef.current = { ...configRef.current, ...config };
  }, []);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      cleanupAnimation();
    };
  }, [cleanupAnimation]);

  // Courbes disponibles
  const availableCurves: FadeCurve[] = useMemo(() => [
    'linear',
    'exponential',
    'logarithmic',
    'cosine',
    'equal_power'
  ], []);

  return {
    // Fonction originale
    crossfadeVolumes,

    // État
    state,
    isTransitioning: state.isActive,
    progress: state.progress,

    // Actions
    startTransition,
    cancelTransition,
    pauseTransition,
    resumeTransition,
    seekTransition,

    // Calculs
    calculateVolumes,
    getVolumeAtProgress,

    // Utilitaires
    getStats,
    getHistory,
    clearHistory,
    configure,

    // Courbes
    availableCurves
  };
}

/** Hook simplifié pour les volumes de crossfade */
export function useCrossfadeVolumes(
  progress: number,
  curve: FadeCurve = 'equal_power'
): { source: number; target: number } {
  return useMemo(() => {
    const sourceVol = calculateVolumeForCurve(progress, curve, true);
    const targetVol = calculateVolumeForCurve(progress, curve, false);
    return { source: sourceVol, target: targetVol };
  }, [progress, curve]);
}

/** Hook de transition automatique */
export function useAutoTransition(
  duration: number = 3000,
  curve: FadeCurve = 'equal_power'
): {
  progress: number;
  isActive: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
} {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (isActive) return;

    setIsActive(true);
    startTimeRef.current = performance.now();

    const animate = (time: number) => {
      if (!startTimeRef.current) return;

      const elapsed = time - startTimeRef.current;
      const newProgress = Math.min(1, elapsed / duration);

      setProgress(newProgress);

      if (newProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsActive(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isActive, duration]);

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setProgress(0);
  }, [stop]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { progress, isActive, start, stop, reset };
}

/** Preset de courbes pour différents styles */
export const CROSSFADE_PRESETS = {
  smooth: { curve: 'equal_power' as FadeCurve, duration: 3000 },
  quick: { curve: 'linear' as FadeCurve, duration: 1000 },
  dramatic: { curve: 'exponential' as FadeCurve, duration: 5000 },
  natural: { curve: 'cosine' as FadeCurve, duration: 2500 },
  dj: { curve: 'equal_power' as FadeCurve, duration: 2000 }
};

export default useCrossfade;
