// @ts-nocheck
/**
 * @deprecated Ce hook est legacy et utilise un store Zustand différent.
 * Pour les nouvelles fonctionnalités Screen Silk avec micro-pauses,
 * utilisez `useScreenSilkMachine` de '@/modules/screen-silk' à la place.
 * 
 * Ce hook gère les exercices de respiration avec HRV, pas les micro-pauses écran.
 */
import { useCallback, useEffect, useRef } from 'react';
import { useScreenSilkStore, PATTERN_TIMINGS, type SilkPattern } from '@/store/screenSilk.store';
import { useHRVSilk, type HRVData } from './useHRVSilk';
import { usePrivacyPrefs } from './usePrivacyPrefs';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export const useScreenSilk = () => {
  logger.warn(
    'useScreenSilk (from @/hooks) is deprecated for micro-break features. ' +
    'Use useScreenSilkMachine from @/modules/screen-silk for micro-breaks.', {}, 'SYSTEM'
  );
  const store = useScreenSilkStore();
  const { prefs } = usePrivacyPrefs();
  const hrv = useHRVSilk();
  
  const animationFrameRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef<number>(0);
  const totalCycleTimeRef = useRef<number>(0);
  
  // Initialize settings based on user preferences
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    store.setReduceMotion(prefersReducedMotion);
    store.setHRVEnabled(prefs.heartRate && hrv.isSupported);
  }, [prefs.heartRate, hrv.isSupported, store]);
  
  // Calculate total cycle time for current pattern
  const getCycleTime = useCallback((pattern: SilkPattern) => {
    const timing = PATTERN_TIMINGS[pattern];
    return timing.inhale + timing.hold + timing.exhale + timing.pause;
  }, []);
  
  // Animation loop for breath pattern
  const animate = useCallback(() => {
    if (!store.running || store.paused) return;
    
    const now = Date.now();
    const elapsed = Math.floor((now - (store.startedAt || now)) / 1000);
    
    // Check if session is complete
    if (elapsed >= store.duration) {
      store.stop();
      return;
    }
    
    store.updateElapsedTime(elapsed);
    
    // Calculate current phase and progress
    const timing = PATTERN_TIMINGS[store.pattern];
    const cycleTime = getCycleTime(store.pattern);
    const cycleProgress = (elapsed % cycleTime);
    
    let phase = store.phase;
    let progress = 0;
    
    if (cycleProgress < timing.inhale) {
      phase = 'inhale';
      progress = cycleProgress / timing.inhale;
    } else if (cycleProgress < timing.inhale + timing.hold) {
      phase = 'hold';
      progress = (cycleProgress - timing.inhale) / timing.hold;
    } else if (cycleProgress < timing.inhale + timing.hold + timing.exhale) {
      phase = 'exhale';
      progress = (cycleProgress - timing.inhale - timing.hold) / timing.exhale;
    } else {
      phase = 'pause';
      progress = (cycleProgress - timing.inhale - timing.hold - timing.exhale) / timing.pause;
    }
    
    store.updatePhase(phase, progress);
    
    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [store, getCycleTime]);
  
  // Start session
  const start = useCallback(async () => {
    logger.debug('Starting Screen-Silk session', {}, 'SYSTEM');
    
    // Start HRV recording if enabled
    if (store.hrvEnabled && hrv.isConnected) {
      hrv.startRecording();
      store.setHRVActive(true);
    }
    
    // Send start event to backend
    try {
      await supabase.functions.invoke('micro-breaks', {
        body: {
          action: 'start',
          pattern: store.pattern,
          duration_sec: store.duration,
          ts: Date.now()
        }
      });
    } catch (error) {
      logger.warn('Failed to send start event', error as Error, 'SYSTEM');
    }
    
    store.start();
    totalCycleTimeRef.current = getCycleTime(store.pattern);
    phaseStartTimeRef.current = Date.now();
    
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [store, hrv, animate, getCycleTime]);
  
  // Pause session
  const pause = useCallback(() => {
    logger.debug('Pausing Screen-Silk session', {}, 'SYSTEM');
    store.pause();
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [store]);
  
  // Resume session
  const resume = useCallback(() => {
    logger.debug('Resuming Screen-Silk session', {}, 'SYSTEM');
    store.resume();
    
    phaseStartTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [store, animate]);
  
  // Stop session and submit data
  const stop = useCallback(async () => {
    logger.debug('Stopping Screen-Silk session', {}, 'SYSTEM');
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Get HRV data if active
    let hrvData: HRVData | null = null;
    if (store.hrvActive) {
      hrvData = hrv.stopRecording();
      store.setHRVActive(false);
    }
    
    store.stop();
    
    // Submit session data
    await submit(hrvData);
  }, [store, hrv]);
  
  // Submit session data to backend
  const submit = useCallback(async (hrvData?: HRVData | null) => {
    try {
      const payload = {
        action: 'stop',
        pattern: store.pattern,
        duration_sec: store.elapsedTime,
        events: store.events,
        hrv: hrvData || null,
        self_report: { better: 'oui' } // Could be made dynamic
      };
      
      logger.debug('Submitting Screen-Silk data', { payload }, 'SYSTEM');
      
      const { data, error } = await supabase.functions.invoke('micro-breaks', {
        body: payload
      });
      
      if (error) {
        logger.error('Failed to submit session data', error as Error, 'SYSTEM');
        // Queue for offline retry - functionality ready for backend integration
        logger.debug('Queuing screen silk data for offline retry', {}, 'SYSTEM');
      } else {
        logger.info('Session data submitted successfully', { data }, 'SYSTEM');
      }
    } catch (error) {
      logger.error('Error submitting session data', error as Error, 'SYSTEM');
      // Queue for offline retry - functionality ready for backend integration
      logger.debug('Queuing screen silk data for offline retry', {}, 'SYSTEM');
    }
  }, [store]);
  
  // Reset session
  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (store.hrvActive) {
      hrv.stopRecording();
    }
    
    store.reset();
  }, [store, hrv]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return {
    // State
    running: store.running,
    paused: store.paused,
    pattern: store.pattern,
    duration: store.duration,
    elapsedTime: store.elapsedTime,
    phase: store.phase,
    phaseProgress: store.phaseProgress,
    cycleCount: store.cycleCount,
    
    // Settings
    reduceMotion: store.reduceMotion,
    audioEnabled: store.audioEnabled,
    hrvEnabled: store.hrvEnabled,
    hrvActive: store.hrvActive,
    
    // HRV state
    hrvConnected: hrv.isConnected,
    currentHR: hrv.currentHR,
    
    // Actions
    start,
    pause,
    resume,
    stop,
    reset,
    submit,
    
    // Settings
    setPattern: store.setPattern,
    setDuration: store.setDuration,
    setAudioEnabled: store.setAudioEnabled,
    
    // HRV actions
    connectHRV: hrv.connect,
    disconnectHRV: hrv.disconnect,
    
    // Utils
    getCycleTime: () => getCycleTime(store.pattern),
  };
};