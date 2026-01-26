// @ts-nocheck
import { useCallback, useEffect, useRef } from 'react';
import { useHRStore } from '@/store/hr.store';
import { logger } from '@/lib/logger';

// Realistic BPM ranges for demo
const RESTING_BPM_RANGE = [60, 90];
const ACTIVE_BPM_RANGE = [90, 140];
const VARIATION_AMPLITUDE = 8; // +/- variation

export const useSimulatedHR = () => {
  const store = useHRStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const baselineRef = useRef<number>(75); // Default resting HR
  const phaseRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(false);

  // Generate realistic BPM with natural variation
  const generateBPM = useCallback((): number => {
    const now = Date.now();
    const secondsElapsed = Math.floor(now / 1000);
    
    // Create slow wave patterns (breathing, activity cycles)
    const breathingWave = Math.sin(secondsElapsed * 0.1) * 3; // Slow breathing variation
    const activityWave = Math.sin(secondsElapsed * 0.02) * 15; // Activity level changes
    const randomNoise = (Math.random() - 0.5) * 4; // Small random variation
    
    // Determine if in "active" phase (simulates movement/stress)
    const activityCycle = Math.sin(secondsElapsed * 0.005);
    isActiveRef.current = activityCycle > 0.3;
    
    // Set baseline based on activity
    const targetBaseline = isActiveRef.current 
      ? ACTIVE_BPM_RANGE[0] + (ACTIVE_BPM_RANGE[1] - ACTIVE_BPM_RANGE[0]) * Math.random()
      : RESTING_BPM_RANGE[0] + (RESTING_BPM_RANGE[1] - RESTING_BPM_RANGE[0]) * Math.random();
    
    // Smooth transition to new baseline (EMA)
    baselineRef.current = 0.95 * baselineRef.current + 0.05 * targetBaseline;
    
    // Combine all variations
    const simulatedBPM = baselineRef.current + breathingWave + activityWave + randomNoise;
    
    // Clamp to realistic range
    return Math.round(Math.max(45, Math.min(180, simulatedBPM)));
  }, []);

  // Start simulation
  const startSimulation = useCallback(() => {
    if (intervalRef.current) return; // Already running
    
    logger.debug('Starting simulated heart rate', {}, 'SYSTEM');
    store.setSource('sim');
    store.setConnected(true);
    store.startSession();
    
    // Initial reading
    const initialBPM = generateBPM();
    store.setBpm(initialBPM);
    store.addReading({
      bpm: initialBPM,
      ts: Date.now(),
      source: 'sim'
    });
    
    // Update every 2 seconds (realistic for heart rate monitors)
    intervalRef.current = setInterval(() => {
      const bpm = generateBPM();
      store.setBpm(bpm);
      store.addReading({
        bpm,
        ts: Date.now(),
        source: 'sim'
      });
    }, 2000);
  }, [store, generateBPM]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    store.setConnected(false);
    store.setBpm(null);
    store.endSession();
    
    logger.debug('Simulated heart rate stopped', {}, 'SYSTEM');
  }, [store]);

  // Set activity level for more realistic simulation
  const setActivityLevel = useCallback((level: 'rest' | 'light' | 'moderate' | 'intense') => {
    const baselines = {
      rest: 65,
      light: 85,
      moderate: 110,
      intense: 140
    };
    
    baselineRef.current = baselines[level];
    logger.debug('Simulated activity level', { level, baseline: baselineRef.current }, 'SYSTEM');
  }, []);

  // Simulate specific BPM for testing
  const setBPM = useCallback((targetBPM: number) => {
    if (targetBPM >= 30 && targetBPM <= 220) {
      baselineRef.current = targetBPM;
      store.setBpm(targetBPM);
      store.addReading({
        bpm: targetBPM,
        ts: Date.now(),
        source: 'sim'
      });
    }
  }, [store]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSimulation();
    };
  }, [stopSimulation]);

  return {
    // State
    isRunning: intervalRef.current !== null,
    bpm: store.bpm,
    avgBpm: store.avgBpm,
    
    // Actions
    startSimulation,
    stopSimulation,
    setActivityLevel,
    setBPM,
    
    // Utils
    generateBPM,
  };
};