// @ts-nocheck
"use client";
/**
 * useAudioBus - Hook de gestion du bus audio global
 * Contrôle du volume, effets audio, et état de lecture
 */

import { useMemo, useRef, useCallback, useEffect, useState } from "react";

/** Configuration du bus audio */
export interface AudioBusConfig {
  initialVolume: number;
  minVolume: number;
  maxVolume: number;
  fadeStep: number;
  fadeInterval: number;
  enableEffects: boolean;
  enableCrossfade: boolean;
  crossfadeDuration: number;
}

/** État du bus audio */
export interface AudioBusState {
  volume: number;
  isMuted: boolean;
  previousVolume: number;
  isPlaying: boolean;
  isFading: boolean;
  currentSource: string | null;
  effectsEnabled: boolean;
}

/** Options d'effet audio */
export interface AudioEffect {
  type: AudioEffectType;
  enabled: boolean;
  parameters: Record<string, number>;
}

/** Types d'effets audio */
export type AudioEffectType =
  | 'reverb'
  | 'delay'
  | 'chorus'
  | 'compressor'
  | 'equalizer'
  | 'lowpass'
  | 'highpass'
  | 'distortion'
  | 'phaser'
  | 'tremolo';

/** Options de fondu */
export interface FadeOptions {
  from?: number;
  to: number;
  duration: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  onComplete?: () => void;
}

/** Statistiques du bus */
export interface AudioBusStats {
  totalPlayTime: number;
  fadeCount: number;
  volumeChanges: number;
  muteToggles: number;
  peakVolume: number;
  averageVolume: number;
}

/** Événement audio */
export type AudioBusEvent =
  | { type: 'volumeChange'; volume: number; previousVolume: number }
  | { type: 'mute'; muted: boolean }
  | { type: 'fadeStart'; from: number; to: number }
  | { type: 'fadeEnd'; finalVolume: number }
  | { type: 'effectToggle'; effect: AudioEffectType; enabled: boolean }
  | { type: 'sourceChange'; source: string | null };

/** Valeurs par défaut */
const DEFAULT_CONFIG: AudioBusConfig = {
  initialVolume: 0.8,
  minVolume: 0,
  maxVolume: 1,
  fadeStep: 0.01,
  fadeInterval: 16,
  enableEffects: false,
  enableCrossfade: true,
  crossfadeDuration: 1000
};

/** Interface du bus audio retournée par le hook */
export interface AudioBusInterface {
  // Propriétés
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  isFading: boolean;
  currentSource: string | null;
  effectsEnabled: boolean;

  // Méthodes de volume
  setVolume: (v: number) => void;
  increaseVolume: (step?: number) => void;
  decreaseVolume: (step?: number) => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;

  // Méthodes de fondu
  fadeIn: (duration?: number) => Promise<void>;
  fadeOut: (duration?: number) => Promise<void>;
  fadeTo: (options: FadeOptions) => Promise<void>;
  cancelFade: () => void;

  // Méthodes de lecture
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSource: (source: string | null) => void;

  // Effets
  enableEffect: (effect: AudioEffectType) => void;
  disableEffect: (effect: AudioEffectType) => void;
  toggleEffect: (effect: AudioEffectType) => void;
  setEffectParameter: (effect: AudioEffectType, param: string, value: number) => void;

  // Utilitaires
  getState: () => AudioBusState;
  getStats: () => AudioBusStats;
  subscribe: (callback: (event: AudioBusEvent) => void) => () => void;
  reset: () => void;
}

/**
 * Hook principal du bus audio
 */
export function useAudioBus(initial = 0.8, config?: Partial<AudioBusConfig>): AudioBusInterface {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config, initialVolume: initial };

  // Refs pour les valeurs mutables
  const volumeRef = useRef(initial);
  const previousVolumeRef = useRef(initial);
  const isMutedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const isFadingRef = useRef(false);
  const currentSourceRef = useRef<string | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const listenersRef = useRef<Array<(event: AudioBusEvent) => void>>([]);
  const effectsRef = useRef<Map<AudioEffectType, AudioEffect>>(new Map());
  const statsRef = useRef<AudioBusStats>({
    totalPlayTime: 0,
    fadeCount: 0,
    volumeChanges: 0,
    muteToggles: 0,
    peakVolume: initial,
    averageVolume: initial
  });

  // État pour forcer le re-render si nécessaire
  const [, forceUpdate] = useState({});

  /** Notifier les listeners */
  const notify = useCallback((event: AudioBusEvent) => {
    listenersRef.current.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('AudioBus listener error:', error);
      }
    });
  }, []);

  /** Contraindre le volume dans les limites */
  const clampVolume = useCallback((v: number) => {
    return Math.max(mergedConfig.minVolume, Math.min(mergedConfig.maxVolume, v));
  }, [mergedConfig.minVolume, mergedConfig.maxVolume]);

  /** Définir le volume */
  const setVolume = useCallback((v: number) => {
    const clamped = clampVolume(v);
    const previous = volumeRef.current;
    volumeRef.current = clamped;

    // Mettre à jour les stats
    statsRef.current.volumeChanges++;
    if (clamped > statsRef.current.peakVolume) {
      statsRef.current.peakVolume = clamped;
    }

    notify({ type: 'volumeChange', volume: clamped, previousVolume: previous });
  }, [clampVolume, notify]);

  /** Augmenter le volume */
  const increaseVolume = useCallback((step = 0.1) => {
    setVolume(volumeRef.current + step);
  }, [setVolume]);

  /** Diminuer le volume */
  const decreaseVolume = useCallback((step = 0.1) => {
    setVolume(volumeRef.current - step);
  }, [setVolume]);

  /** Muter */
  const mute = useCallback(() => {
    if (!isMutedRef.current) {
      previousVolumeRef.current = volumeRef.current;
      isMutedRef.current = true;
      statsRef.current.muteToggles++;
      notify({ type: 'mute', muted: true });
    }
  }, [notify]);

  /** Démuter */
  const unmute = useCallback(() => {
    if (isMutedRef.current) {
      isMutedRef.current = false;
      statsRef.current.muteToggles++;
      notify({ type: 'mute', muted: false });
    }
  }, [notify]);

  /** Basculer mute */
  const toggleMute = useCallback(() => {
    if (isMutedRef.current) {
      unmute();
    } else {
      mute();
    }
  }, [mute, unmute]);

  /** Annuler le fondu */
  const cancelFade = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
      isFadingRef.current = false;
    }
  }, []);

  /** Fondu vers une valeur */
  const fadeTo = useCallback((options: FadeOptions): Promise<void> => {
    return new Promise((resolve) => {
      cancelFade();

      const from = options.from ?? volumeRef.current;
      const to = clampVolume(options.to);
      const duration = options.duration;
      const steps = Math.ceil(duration / mergedConfig.fadeInterval);
      const stepValue = (to - from) / steps;

      let currentStep = 0;
      isFadingRef.current = true;
      statsRef.current.fadeCount++;

      notify({ type: 'fadeStart', from, to });

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const newVolume = from + (stepValue * currentStep);

        volumeRef.current = currentStep >= steps ? to : clampVolume(newVolume);

        if (currentStep >= steps) {
          cancelFade();
          notify({ type: 'fadeEnd', finalVolume: to });
          options.onComplete?.();
          resolve();
        }
      }, mergedConfig.fadeInterval);
    });
  }, [cancelFade, clampVolume, mergedConfig.fadeInterval, notify]);

  /** Fondu entrant */
  const fadeIn = useCallback((duration = 1000) => {
    return fadeTo({ to: previousVolumeRef.current || 1, duration });
  }, [fadeTo]);

  /** Fondu sortant */
  const fadeOut = useCallback((duration = 1000) => {
    return fadeTo({ to: 0, duration });
  }, [fadeTo]);

  /** Lecture */
  const play = useCallback(() => {
    isPlayingRef.current = true;
    forceUpdate({});
  }, []);

  /** Pause */
  const pause = useCallback(() => {
    isPlayingRef.current = false;
    forceUpdate({});
  }, []);

  /** Stop */
  const stop = useCallback(() => {
    isPlayingRef.current = false;
    currentSourceRef.current = null;
    forceUpdate({});
  }, []);

  /** Définir la source */
  const setSource = useCallback((source: string | null) => {
    currentSourceRef.current = source;
    notify({ type: 'sourceChange', source });
    forceUpdate({});
  }, [notify]);

  /** Activer un effet */
  const enableEffect = useCallback((effect: AudioEffectType) => {
    const existing = effectsRef.current.get(effect);
    if (existing) {
      existing.enabled = true;
    } else {
      effectsRef.current.set(effect, { type: effect, enabled: true, parameters: {} });
    }
    notify({ type: 'effectToggle', effect, enabled: true });
  }, [notify]);

  /** Désactiver un effet */
  const disableEffect = useCallback((effect: AudioEffectType) => {
    const existing = effectsRef.current.get(effect);
    if (existing) {
      existing.enabled = false;
      notify({ type: 'effectToggle', effect, enabled: false });
    }
  }, [notify]);

  /** Basculer un effet */
  const toggleEffect = useCallback((effect: AudioEffectType) => {
    const existing = effectsRef.current.get(effect);
    if (existing?.enabled) {
      disableEffect(effect);
    } else {
      enableEffect(effect);
    }
  }, [enableEffect, disableEffect]);

  /** Définir un paramètre d'effet */
  const setEffectParameter = useCallback((effect: AudioEffectType, param: string, value: number) => {
    const existing = effectsRef.current.get(effect);
    if (existing) {
      existing.parameters[param] = value;
    }
  }, []);

  /** Obtenir l'état */
  const getState = useCallback((): AudioBusState => ({
    volume: volumeRef.current,
    isMuted: isMutedRef.current,
    previousVolume: previousVolumeRef.current,
    isPlaying: isPlayingRef.current,
    isFading: isFadingRef.current,
    currentSource: currentSourceRef.current,
    effectsEnabled: effectsRef.current.size > 0
  }), []);

  /** Obtenir les stats */
  const getStats = useCallback((): AudioBusStats => ({
    ...statsRef.current
  }), []);

  /** S'abonner aux événements */
  const subscribe = useCallback((callback: (event: AudioBusEvent) => void): () => void => {
    listenersRef.current.push(callback);
    return () => {
      const index = listenersRef.current.indexOf(callback);
      if (index > -1) {
        listenersRef.current.splice(index, 1);
      }
    };
  }, []);

  /** Réinitialiser */
  const reset = useCallback(() => {
    cancelFade();
    volumeRef.current = mergedConfig.initialVolume;
    previousVolumeRef.current = mergedConfig.initialVolume;
    isMutedRef.current = false;
    isPlayingRef.current = false;
    currentSourceRef.current = null;
    effectsRef.current.clear();
    statsRef.current = {
      totalPlayTime: 0,
      fadeCount: 0,
      volumeChanges: 0,
      muteToggles: 0,
      peakVolume: mergedConfig.initialVolume,
      averageVolume: mergedConfig.initialVolume
    };
    forceUpdate({});
  }, [cancelFade, mergedConfig.initialVolume]);

  // Nettoyage à la destruction
  useEffect(() => {
    return () => {
      cancelFade();
      listenersRef.current = [];
    };
  }, [cancelFade]);

  return useMemo(() => ({
    // Propriétés (getters)
    get volume() { return isMutedRef.current ? 0 : volumeRef.current; },
    get isMuted() { return isMutedRef.current; },
    get isPlaying() { return isPlayingRef.current; },
    get isFading() { return isFadingRef.current; },
    get currentSource() { return currentSourceRef.current; },
    get effectsEnabled() { return effectsRef.current.size > 0; },

    // Méthodes
    setVolume,
    increaseVolume,
    decreaseVolume,
    mute,
    unmute,
    toggleMute,
    fadeIn,
    fadeOut,
    fadeTo,
    cancelFade,
    play,
    pause,
    stop,
    setSource,
    enableEffect,
    disableEffect,
    toggleEffect,
    setEffectParameter,
    getState,
    getStats,
    subscribe,
    reset
  }), [
    setVolume, increaseVolume, decreaseVolume,
    mute, unmute, toggleMute,
    fadeIn, fadeOut, fadeTo, cancelFade,
    play, pause, stop, setSource,
    enableEffect, disableEffect, toggleEffect, setEffectParameter,
    getState, getStats, subscribe, reset
  ]);
}

/** Hook simplifié pour le volume uniquement */
export function useAudioVolume(initial = 0.8) {
  const bus = useAudioBus(initial);
  return {
    volume: bus.volume,
    setVolume: bus.setVolume,
    mute: bus.mute,
    unmute: bus.unmute,
    toggleMute: bus.toggleMute
  };
}

export default useAudioBus;
