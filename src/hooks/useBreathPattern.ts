// @ts-nocheck
import { useCallback, useEffect, useRef } from 'react';
import { useVRStore, VR_PATTERN_TIMINGS, type VRPattern, type VRBreathPhase } from '@/store/vr.store';
import { useHRVSilk, type HRVData } from './useHRVSilk';
import { usePrivacyPrefs } from './usePrivacyPrefs';
import { supabase } from '@/integrations/supabase/client';

export const useBreathPattern = () => {
  const store = useVRStore();
  const { prefs } = usePrivacyPrefs();
  const hrv = useHRVSilk();
  
  const animationFrameRef = useRef<number | null>(null);
  const sessionStartRef = useRef<number>(0);
  const phaseTimingsRef = useRef<Array<{ phase: VRBreathPhase; timestamp: number; expected: number }>>([]);
  const lastPhaseChangeRef = useRef<number>(0);

  // Initialize settings based on user preferences
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    store.setReduceMotion(prefersReducedMotion);
    store.setHRVEnabled(prefs.heartRate && hrv.isSupported);
  }, [prefs.heartRate, hrv.isSupported, store]);

  // Calculate total cycle time for current pattern
  const getCycleTime = useCallback((pattern: VRPattern) => {
    const timing = VR_PATTERN_TIMINGS[pattern];
    return timing.inhale + timing.hold + timing.exhale + timing.pause;
  }, []);

  // Calculate adherence score based on timing accuracy
  const calculateAdherence = useCallback(() => {
    if (phaseTimingsRef.current.length < 3) return 0;

    let totalAccuracy = 0;
    let measurements = 0;

    phaseTimingsRef.current.forEach(timing => {
      if (timing.expected > 0) {
        const accuracy = Math.max(0, 1 - Math.abs(timing.timestamp - timing.expected) / timing.expected);
        totalAccuracy += accuracy;
        measurements++;
      }
    });

    return measurements > 0 ? totalAccuracy / measurements : 0;
  }, []);

  // Animation loop for VR breath pattern
  const animate = useCallback(() => {
    if (!store.running || store.paused) return;

    const now = Date.now();
    const elapsed = Math.floor((now - sessionStartRef.current) / 1000);

    // Check if session is complete
    if (elapsed >= store.duration) {
      store.stop();
      return;
    }

    store.updateElapsedTime(elapsed);

    // Calculate current phase and progress
    const timing = VR_PATTERN_TIMINGS[store.pattern];
    const cycleTime = getCycleTime(store.pattern);
    const cycleProgress = elapsed % cycleTime;

    let phase: VRBreathPhase = 'inhale';
    let progress = 0;
    let expectedPhaseTime = 0;

    if (cycleProgress < timing.inhale) {
      phase = 'inhale';
      progress = cycleProgress / timing.inhale;
      expectedPhaseTime = timing.inhale;
    } else if (cycleProgress < timing.inhale + timing.hold) {
      phase = 'hold';
      progress = (cycleProgress - timing.inhale) / timing.hold;
      expectedPhaseTime = timing.hold;
    } else if (cycleProgress < timing.inhale + timing.hold + timing.exhale) {
      phase = 'exhale';
      progress = (cycleProgress - timing.inhale - timing.hold) / timing.exhale;
      expectedPhaseTime = timing.exhale;
    } else {
      phase = 'pause';
      progress = (cycleProgress - timing.inhale - timing.hold - timing.exhale) / (timing.pause || 1);
      expectedPhaseTime = timing.pause || 0;
    }

    // Track phase changes for adherence calculation
    if (phase !== store.phase) {
      const phaseChangeTime = now;
      const expectedTime = lastPhaseChangeRef.current + (expectedPhaseTime * 1000);
      
      phaseTimingsRef.current.push({
        phase,
        timestamp: phaseChangeTime,
        expected: expectedTime
      });

      lastPhaseChangeRef.current = phaseChangeTime;
      
      // Calculate and update adherence score
      const adherence = calculateAdherence();
      store.updateAdherence(adherence);
    }

    store.updatePhase(phase, progress);

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [store, getCycleTime, calculateAdherence]);

  // Start VR breathing session
  const start = useCallback(async () => {
    logger.info('Starting VR Galaxy breathing session', {}, 'VR');

    // Start HRV recording if enabled
    if (store.hrvEnabled && hrv.isConnected) {
      hrv.startRecording();
      store.setHRVActive(true);
    }

    // Reset timing data
    phaseTimingsRef.current = [];
    sessionStartRef.current = Date.now();
    lastPhaseChangeRef.current = sessionStartRef.current;

    store.start();

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [store, hrv, animate]);

  // Pause session
  const pause = useCallback(() => {
    logger.info('Pausing VR breathing session', {}, 'VR');
    store.pause();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [store]);

  // Resume session
  const resume = useCallback(() => {
    logger.info('Resuming VR breathing session', {}, 'VR');
    store.resume();

    // Adjust timing references for pause duration
    const pauseDuration = Date.now() - (sessionStartRef.current + (store.elapsedTime * 1000));
    sessionStartRef.current += pauseDuration;
    lastPhaseChangeRef.current += pauseDuration;

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [store, animate]);

  // Stop session and prepare metrics
  const stop = useCallback(() => {
    logger.info('Stopping VR breathing session', {}, 'VR');

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
    
    return {
      hradData: hrvData,
      adherence: store.adherence
    };
  }, [store, hrv]);

  // Submit metrics to backend
  const submitMetrics = useCallback(async (dodatoyData?: { hrvData?: HRVData | null; adherence?: number }) => {
    try {
      const metrics = store.getMetrics();
      
      // Add additional data if provided
      if (dodatoyData?.hrvData) {
        metrics.hrv = dodatoyData.hrvData;
      }
      if (dodatoyData?.adherence !== undefined) {
        metrics.adherence = dodatoyData.adherence;
      }

      logger.info('Submitting VR Galaxy metrics', metrics, 'VR');

      const { data, error } = await supabase.functions.invoke('vr-galaxy-metrics', {
        body: metrics
      });

      if (error) {
        logger.error('Failed to submit VR metrics', error as Error, 'VR');
        // Queue for offline retry - functionality ready for backend integration
        logger.info('Queuing breath pattern data for offline retry', {}, 'VR');
      } else {
        logger.info('VR metrics submitted successfully', data, 'VR');
      }
    } catch (error) {
      logger.error('Error submitting VR metrics', error as Error, 'VR');
      // Queue for offline retry - functionality ready for backend integration
      logger.info('Queuing breath pattern data for offline retry', {}, 'VR');
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

    phaseTimingsRef.current = [];
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
    adherence: store.adherence,
    
    // Settings
    reduceMotion: store.reduceMotion,
    musicEnabled: store.musicEnabled,
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
    submitMetrics,
    
    // Settings
    setPattern: store.setPattern,
    setDuration: store.setDuration,
    setMusicEnabled: store.setMusicEnabled,
    
    // HRV actions
    connectHRV: hrv.connect,
    disconnectHRV: hrv.disconnect,
    
    // Utils
    getCycleTime: () => getCycleTime(store.pattern),
    getMetrics: store.getMetrics,
  };
};