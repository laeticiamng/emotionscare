import { useState, useEffect, useRef, useCallback } from 'react';
import { useVRBreathStore, VRBreathPattern, VRBreathMetrics } from '@/store/vrbreath.store';

interface BreathingPhase {
  type: 'inhale' | 'hold' | 'exhale';
  duration: number; // seconds
}

const PATTERNS: Record<VRBreathPattern, BreathingPhase[]> = {
  '4-2-4': [
    { type: 'inhale', duration: 4 },
    { type: 'hold', duration: 2 },
    { type: 'exhale', duration: 4 }
  ],
  '4-6-8': [
    { type: 'inhale', duration: 4 },
    { type: 'hold', duration: 6 },
    { type: 'exhale', duration: 8 }
  ],
  '5-5': [
    { type: 'inhale', duration: 5 },
    { type: 'exhale', duration: 5 }
  ]
};

export const useBreathingPattern = () => {
  const { pattern, running, startedAt, setPattern, setRunning, setStartedAt } = useVRBreathStore();
  
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase | null>(null);
  const [phaseProgress, setPhaseProgress] = useState(0); // 0-1
  const [cycleCount, setCycleCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartRef = useRef<number>(0);
  const adherenceDataRef = useRef<number[]>([]);

  const patternPhases = PATTERNS[pattern];
  const currentPhaseIndex = useRef(0);

  // Duration-based completion (3-5 minutes as specified)
  const targetDuration = 4 * 60 * 1000; // 4 minutes in milliseconds

  const start = useCallback(() => {
    if (running) return;

    const now = Date.now();
    setRunning(true);
    setStartedAt(now);
    setIsComplete(false);
    setCycleCount(0);
    currentPhaseIndex.current = 0;
    phaseStartRef.current = now;
    adherenceDataRef.current = [];
    
    // Start with first phase
    setCurrentPhase(patternPhases[0]);
  }, [running, setRunning, setStartedAt, patternPhases]);

  const pause = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [setRunning]);

  const finish = useCallback(() => {
    setRunning(false);
    setIsComplete(true);
    setCurrentPhase(null);
    setPhaseProgress(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [setRunning]);

  // Main breathing loop
  useEffect(() => {
    if (!running || !currentPhase) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const phaseElapsed = (now - phaseStartRef.current) / 1000;
      const progress = Math.min(phaseElapsed / currentPhase.duration, 1);
      
      setPhaseProgress(progress);

      // Simple adherence estimation (staying in rhythm)
      if (progress <= 1) {
        adherenceDataRef.current.push(Math.abs(progress - 0.5) < 0.3 ? 1 : 0.7);
      }

      // Phase complete
      if (progress >= 1) {
        currentPhaseIndex.current = (currentPhaseIndex.current + 1) % patternPhases.length;
        
        // New cycle started
        if (currentPhaseIndex.current === 0) {
          setCycleCount(prev => prev + 1);
        }
        
        setCurrentPhase(patternPhases[currentPhaseIndex.current]);
        phaseStartRef.current = now;
        setPhaseProgress(0);

        // Check if target duration reached
        if (startedAt && (now - startedAt) >= targetDuration) {
          finish();
        }
      }
    }, 100); // 10 FPS update rate

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, currentPhase, patternPhases, startedAt, targetDuration, finish]);

  // Generate metrics
  const metrics = useCallback((): VRBreathMetrics | null => {
    if (!startedAt) return null;

    const endTime = Date.now();
    const duration = Math.round((endTime - startedAt) / 1000);
    
    // Calculate adherence from collected data
    const adherence = adherenceDataRef.current.length > 0
      ? adherenceDataRef.current.reduce((a, b) => a + b, 0) / adherenceDataRef.current.length
      : 0.5;

    return {
      pattern,
      duration_sec: duration,
      adherence: Math.round(adherence * 100) / 100, // Round to 2 decimals
      ts: Math.round(startedAt / 1000)
    };
  }, [pattern, startedAt]);

  return {
    pattern,
    setPattern,
    currentPhase,
    phaseProgress,
    cycleCount,
    running,
    isComplete,
    start,
    pause,
    finish,
    metrics,
  };
};