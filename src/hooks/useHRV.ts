import { useState, useCallback, useEffect, useRef } from 'react';
import { HRVSummary } from '@/store/bounce.store';

interface HRVConfig {
  enabled: boolean;
  sampleRate?: number; // samples per second, default 1
  onHRVUpdate?: (hrv: number) => void;
}

export const useHRV = (config: HRVConfig) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentHRV, setCurrentHRV] = useState<number>(0);
  const [baseline, setBaseline] = useState<number | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const samplesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number | null>(null);

  const startCapture = useCallback(async () => {
    if (!config.enabled) {
      console.log('HRV disabled by config');
      return;
    }

    try {
      setError(null);
      
      // Check for available APIs (HealthKit on iOS, Google Fit on Android)
      if (typeof (window as any).HealthKit !== 'undefined') {
        // iOS HealthKit integration
        const healthKit = (window as any).HealthKit;
        const success = await healthKit.requestAuthorization(['heartRate']);
        
        if (!success) {
          throw new Error('Permission refusée pour HealthKit');
        }
        
        startTimeRef.current = Date.now();
        setIsActive(true);
        startHRVCollection();
        
      } else if (typeof (window as any).GoogleFit !== 'undefined') {
        // Android Google Fit integration
        const googleFit = (window as any).GoogleFit;
        const success = await googleFit.requestAuthorization(['heartRate']);
        
        if (!success) {
          throw new Error('Permission refusée pour Google Fit');
        }
        
        startTimeRef.current = Date.now();
        setIsActive(true);
        startHRVCollection();
        
      } else {
        // Fallback: simulation for web/testing
        console.log('HRV simulation mode (no native health APIs available)');
        startTimeRef.current = Date.now();
        setIsActive(true);
        startHRVSimulation();
      }
      
    } catch (error) {
      console.error('Error starting HRV capture:', error);
      setError('Impossible d\'accéder aux capteurs de fréquence cardiaque');
    }
  }, [config]);

  const stopCapture = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsActive(false);
  }, []);

  const startHRVCollection = useCallback(() => {
    if (!config.enabled) return;
    
    const sampleRate = config.sampleRate || 1;
    const interval = 1000 / sampleRate;
    
    intervalRef.current = setInterval(async () => {
      try {
        let hrv = 0;
        
        // Try to get real HRV data
        if (typeof (window as any).HealthKit !== 'undefined') {
          const healthKit = (window as any).HealthKit;
          const data = await healthKit.getLatestSample('heartRateVariability');
          hrv = data?.value || 0;
        } else if (typeof (window as any).GoogleFit !== 'undefined') {
          const googleFit = (window as any).GoogleFit;
          const data = await googleFit.getLatestSample('heartRateVariability');
          hrv = data?.value || 0;
        }
        
        if (hrv > 0) {
          samplesRef.current.push(hrv);
          setCurrentHRV(hrv);
          
          // Set baseline from first few samples
          if (!baseline && samplesRef.current.length === 10) {
            const avgBaseline = samplesRef.current.reduce((a, b) => a + b, 0) / samplesRef.current.length;
            setBaseline(avgBaseline);
          }
          
          config.onHRVUpdate?.(hrv);
        }
      } catch (error) {
        console.error('Error collecting HRV sample:', error);
      }
    }, interval);
  }, [config, baseline]);

  const startHRVSimulation = useCallback(() => {
    const sampleRate = config.sampleRate || 1;
    const interval = 1000 / sampleRate;
    
    // Simulate realistic HRV values (20-100 ms, varying with stress)
    let baseHRV = 50 + Math.random() * 30; // 50-80 ms baseline
    let trend = 0; // Current stress trend
    
    intervalRef.current = setInterval(() => {
      // Add some randomness and stress-related changes
      const noise = (Math.random() - 0.5) * 10; // ±5 ms noise
      trend += (Math.random() - 0.5) * 2; // Slow trend changes
      trend = Math.max(-20, Math.min(20, trend)); // Limit trend
      
      const simulatedHRV = Math.max(20, Math.min(100, baseHRV + trend + noise));
      
      samplesRef.current.push(simulatedHRV);
      setCurrentHRV(simulatedHRV);
      
      // Set baseline from first few samples
      if (!baseline && samplesRef.current.length === 10) {
        const avgBaseline = samplesRef.current.reduce((a, b) => a + b, 0) / samplesRef.current.length;
        setBaseline(avgBaseline);
      }
      
      config.onHRVUpdate?.(simulatedHRV);
      
      // Keep only recent samples (last 60 seconds)
      const maxSamples = 60 * sampleRate;
      if (samplesRef.current.length > maxSamples) {
        samplesRef.current = samplesRef.current.slice(-maxSamples);
      }
    }, interval);
  }, [config, baseline]);

  const getSummary = useCallback((): HRVSummary => {
    const samples = samplesRef.current;
    if (samples.length === 0) {
      return {};
    }
    
    // Calculate different phases
    const totalSamples = samples.length;
    const baselinePhase = samples.slice(0, Math.floor(totalSamples * 0.2));
    const duringPhase = samples.slice(Math.floor(totalSamples * 0.2), Math.floor(totalSamples * 0.8));
    const afterPhase = samples.slice(Math.floor(totalSamples * 0.8));
    
    const average = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    
    return {
      baseline: baseline || average(baselinePhase),
      during: average(duringPhase),
      after: average(afterPhase)
    };
  }, [baseline]);

  const getStressLevel = useCallback((): number => {
    if (!baseline || samplesRef.current.length === 0) {
      return 0.5; // Neutral if no data
    }
    
    const recent = samplesRef.current.slice(-10); // Last 10 samples
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    
    // Lower HRV typically indicates higher stress
    // Normalize to 0-1 scale where 1 is high stress
    const stressRatio = baseline / avgRecent;
    return Math.max(0, Math.min(1, (stressRatio - 1) * 2 + 0.5));
  }, [baseline]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  return {
    isActive,
    error,
    currentHRV,
    baseline,
    stressLevel: getStressLevel(),
    startCapture,
    stopCapture,
    getSummary,
    samples: samplesRef.current.slice(), // Return copy for safety
  };
};
