import { useEffect, useRef, useCallback } from 'react';
import { useBreathStore, Pattern, Phase, BreathEvent, BreathMetrics } from '@/store/breath.store';

const PATTERNS = {
  '4-6-8': [
    { type: 'inhale' as const, duration: 4 },
    { type: 'hold' as const, duration: 6 },
    { type: 'exhale' as const, duration: 8 }
  ],
  '5-5': [
    { type: 'inhale' as const, duration: 5 },
    { type: 'exhale' as const, duration: 5 }
  ],
  '4-2-4': [
    { type: 'inhale' as const, duration: 4 },
    { type: 'hold' as const, duration: 2 },
    { type: 'exhale' as const, duration: 4 }
  ]
} as const;

export const useBreathwork = () => {
  const state = useBreathStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartRef = useRef<number>(0);
  const currentPhaseIndexRef = useRef(0);

  const patternPhases = PATTERNS[state.pattern];

  // Start session
  const start = useCallback(() => {
    if (state.running) return;

    const now = Date.now();
    state.setRunning(true);
    state.setPaused(false);
    state.setFinished(false);
    state.setStartedAt(now);
    state.setElapsed(0);
    state.setCycleCount(0);
    state.setPhase(patternPhases[0].type);
    state.setPhaseProgress(0);
    
    currentPhaseIndexRef.current = 0;
    phaseStartRef.current = now;
    
    // Add start event
    state.addEvent({ t: 0, type: 'start' });

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'breath_start', {
        custom_pattern: state.pattern,
        custom_duration: state.duration
      });
    }
  }, [state, patternPhases]);

  // Pause session
  const pause = useCallback(() => {
    state.setPaused(true);
    state.addEvent({ t: state.elapsed, type: 'pause' });

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'breath_pause');
    }
  }, [state]);

  // Resume session
  const resume = useCallback(() => {
    state.setPaused(false);
    phaseStartRef.current = Date.now() - (state.phaseProgress * patternPhases[currentPhaseIndexRef.current].duration * 1000);
    state.addEvent({ t: state.elapsed, type: 'resume' });

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'breath_resume');
    }
  }, [state, patternPhases]);

  // Finish session
  const finish = useCallback(() => {
    state.setRunning(false);
    state.setFinished(true);
    state.addEvent({ t: state.elapsed, type: 'finish' });

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'breath_finish', {
        custom_duration_completed: state.elapsed
      });
    }
  }, [state]);

  // Submit metrics
  const submit = useCallback(async () => {
    const metrics: BreathMetrics = {
      pattern: state.pattern,
      duration_sec: state.elapsed,
      events: state.events,
    };

    try {
      const response = await fetch('/api/me/breath/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.badge_id) {
          state.setBadgeEarned(result.badge_id);
        }

        // Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'breath_metrics_sent');
        }
      }
    } catch (error) {
      console.warn('Failed to submit breath metrics:', error);
      // Could implement offline queue here
    }
  }, [state]);

  // Main breathing loop
  useEffect(() => {
    if (!state.running || state.paused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const sessionElapsed = Math.floor((now - (state.startedAt || now)) / 1000);
      
      // Update session elapsed time
      state.setElapsed(sessionElapsed);

      // Check if session should end
      if (sessionElapsed >= state.duration) {
        finish();
        return;
      }

      // Update phase progress
      const currentPhase = patternPhases[currentPhaseIndexRef.current];
      const phaseElapsed = (now - phaseStartRef.current) / 1000;
      const progress = Math.min(phaseElapsed / currentPhase.duration, 1);
      
      state.setPhaseProgress(progress);

      // Move to next phase
      if (progress >= 1) {
        currentPhaseIndexRef.current = (currentPhaseIndexRef.current + 1) % patternPhases.length;
        
        // New cycle started
        if (currentPhaseIndexRef.current === 0) {
          state.setCycleCount(state.cycleCount + 1);
        }
        
        const nextPhase = patternPhases[currentPhaseIndexRef.current];
        state.setPhase(nextPhase.type);
        state.setPhaseProgress(0);
        phaseStartRef.current = now;

        // Haptic feedback
        if (state.hapticEnabled && 'navigator' in window && 'vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    }, 100); // 10 FPS update rate

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.running, state.paused, state.startedAt, state.duration, patternPhases, finish, state]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't handle if in input
      }

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          if (!state.running) {
            start();
          } else if (state.paused) {
            resume();
          } else {
            pause();
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (state.running) {
            finish();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.running, state.paused, start, pause, resume, finish]);

  return {
    state,
    start,
    pause,
    resume,
    finish,
    submit,
    setPattern: state.setPattern,
    setDuration: state.setDuration,
  };
};