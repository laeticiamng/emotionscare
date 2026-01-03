/**
 * useBattleFeedback - Hook pour les feedbacks audio et haptique
 * Gère les sons et vibrations pendant les batailles Bounce-Back
 */

import { useCallback, useRef, useEffect } from 'react';

interface FeedbackOptions {
  enableSound?: boolean;
  enableHaptics?: boolean;
  volume?: number;
}

const DEFAULT_OPTIONS: FeedbackOptions = {
  enableSound: true,
  enableHaptics: true,
  volume: 0.5
};

// Sound frequencies and durations (using Web Audio API)
const SOUNDS = {
  stimulus: { frequency: 440, duration: 150, type: 'sine' as OscillatorType },
  dismiss: { frequency: 880, duration: 100, type: 'sine' as OscillatorType },
  calmStart: { frequency: 220, duration: 500, type: 'sine' as OscillatorType },
  calmEnd: { frequency: 330, duration: 300, type: 'sine' as OscillatorType },
  combo: { frequency: 660, duration: 200, type: 'triangle' as OscillatorType },
  complete: { frequency: 523.25, duration: 400, type: 'sine' as OscillatorType }, // C5
  warning: { frequency: 349.23, duration: 250, type: 'sawtooth' as OscillatorType }
};

// Haptic patterns (duration in ms)
const HAPTICS = {
  light: [50],
  medium: [100],
  heavy: [200],
  success: [50, 50, 100],
  warning: [100, 50, 100],
  double: [50, 30, 50],
  pulse: [50, 100, 50, 100, 50]
};

export function useBattleFeedback(options: FeedbackOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize audio context on first user interaction
  const initAudio = useCallback(() => {
    if (!audioContextRef.current && opts.enableSound) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = opts.volume ?? 0.5;
        gainNodeRef.current.connect(audioContextRef.current.destination);
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
  }, [opts.enableSound, opts.volume]);

  // Play a tone
  const playTone = useCallback((soundKey: keyof typeof SOUNDS) => {
    if (!opts.enableSound || !audioContextRef.current || !gainNodeRef.current) return;

    const sound = SOUNDS[soundKey];
    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;

    try {
      const oscillator = ctx.createOscillator();
      oscillator.type = sound.type;
      oscillator.frequency.setValueAtTime(sound.frequency, ctx.currentTime);
      
      const envelope = ctx.createGain();
      envelope.gain.setValueAtTime(0, ctx.currentTime);
      envelope.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.01);
      envelope.gain.linearRampToValueAtTime(0, ctx.currentTime + sound.duration / 1000);
      
      oscillator.connect(envelope);
      envelope.connect(gain);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + sound.duration / 1000 + 0.01);
    } catch (e) {
      // Silently fail if audio playback fails
    }
  }, [opts.enableSound]);

  // Trigger haptic feedback
  const vibrate = useCallback((pattern: keyof typeof HAPTICS) => {
    if (!opts.enableHaptics || !navigator.vibrate) return;
    
    try {
      navigator.vibrate(HAPTICS[pattern]);
    } catch (e) {
      // Silently fail if vibration not supported
    }
  }, [opts.enableHaptics]);

  // Combined feedback actions
  const onStimulusAppear = useCallback(() => {
    initAudio();
    playTone('stimulus');
    vibrate('medium');
  }, [initAudio, playTone, vibrate]);

  const onStimulusDismiss = useCallback(() => {
    playTone('dismiss');
    vibrate('light');
  }, [playTone, vibrate]);

  const onCombo = useCallback((comboCount: number) => {
    if (comboCount >= 3) {
      playTone('combo');
      vibrate('success');
    } else {
      vibrate('double');
    }
  }, [playTone, vibrate]);

  const onCalmStart = useCallback(() => {
    playTone('calmStart');
    vibrate('pulse');
  }, [playTone, vibrate]);

  const onCalmEnd = useCallback(() => {
    playTone('calmEnd');
    vibrate('light');
  }, [playTone, vibrate]);

  const onBattleComplete = useCallback(() => {
    playTone('complete');
    vibrate('success');
  }, [playTone, vibrate]);

  const onWarning = useCallback(() => {
    playTone('warning');
    vibrate('warning');
  }, [playTone, vibrate]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = opts.volume ?? 0.5;
    }
  }, [opts.volume]);

  return {
    initAudio,
    onStimulusAppear,
    onStimulusDismiss,
    onCombo,
    onCalmStart,
    onCalmEnd,
    onBattleComplete,
    onWarning,
    // Raw methods for custom usage
    playTone,
    vibrate
  };
}
