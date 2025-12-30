/**
 * useFlashGlowAudio - Hook pour l'audio et l'haptique Flash Glow
 * Utilise Web Audio API directement pour générer des tons
 */

import { useCallback, useRef, useEffect } from 'react';

interface FlashGlowAudioConfig {
  audioEnabled: boolean;
  hapticsEnabled: boolean;
  volume?: number;
}

const HAPTIC_PATTERNS: Record<string, number[]> = {
  start: [100, 50, 100],
  phase: [50],
  complete: [100, 50, 100, 50, 200],
  extend: [50, 30, 50],
  pulse: [30],
};

export const useFlashGlowAudio = (config: FlashGlowAudioConfig) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, volume: number, duration: number) => {
    if (!configRef.current.audioEnabled) return;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      const adjustedVolume = (configRef.current.volume ?? 0.5) * volume;
      gainNode.gain.setValueAtTime(adjustedVolume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Silently fail if audio not supported
    }
  }, [getAudioContext]);

  const triggerHaptic = useCallback((pattern: keyof typeof HAPTIC_PATTERNS = 'pulse') => {
    if (!configRef.current.hapticsEnabled) return;
    
    if ('vibrate' in navigator) {
      const hapticPattern = HAPTIC_PATTERNS[pattern] || HAPTIC_PATTERNS.pulse;
      navigator.vibrate(hapticPattern);
    }
  }, []);

  const playPhaseSound = useCallback((phase: string) => {
    const sounds: Record<string, { frequency: number; duration: number }> = {
      warmup: { frequency: 396, duration: 0.5 },
      glow: { frequency: 528, duration: 0.3 },
      settle: { frequency: 432, duration: 0.4 },
      complete: { frequency: 639, duration: 0.8 },
      extend: { frequency: 741, duration: 0.3 },
    };

    const sound = sounds[phase];
    if (!sound) return;

    playTone(sound.frequency, 0.5, sound.duration);
  }, [playTone]);

  const playStartSound = useCallback(() => {
    playTone(396, 0.4, 0.3);
    setTimeout(() => playTone(528, 0.4, 0.3), 150);
    setTimeout(() => playTone(639, 0.4, 0.5), 300);
    triggerHaptic('start');
  }, [playTone, triggerHaptic]);

  const playCompleteSound = useCallback(() => {
    playTone(528, 0.5, 0.4);
    setTimeout(() => playTone(639, 0.5, 0.4), 200);
    setTimeout(() => playTone(741, 0.5, 0.6), 400);
    triggerHaptic('complete');
  }, [playTone, triggerHaptic]);

  const playExtendSound = useCallback(() => {
    playTone(432, 0.3, 0.2);
    setTimeout(() => playTone(528, 0.3, 0.3), 100);
    triggerHaptic('extend');
  }, [playTone, triggerHaptic]);

  const playPulse = useCallback((intensity: number = 0.5) => {
    const freq = 300 + (intensity * 300);
    playTone(freq, 0.2, 0.1);

    if (configRef.current.hapticsEnabled && intensity > 0.7) {
      triggerHaptic('pulse');
    }
  }, [playTone, triggerHaptic]);

  const playBreathGuide = useCallback((phase: 'inhale' | 'hold' | 'exhale') => {
    const frequencies = {
      inhale: 440,
      hold: 523,
      exhale: 349,
    };

    playTone(frequencies[phase], 0.3, 0.3);
    triggerHaptic('pulse');
  }, [playTone, triggerHaptic]);

  const stopAllSounds = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playPhaseSound,
    playStartSound,
    playCompleteSound,
    playExtendSound,
    playPulse,
    playBreathGuide,
    triggerHaptic,
    stopAllSounds,
  };
};

export default useFlashGlowAudio;
