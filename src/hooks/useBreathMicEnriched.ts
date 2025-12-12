/**
 * useBreathMicEnriched - Détection respiration via microphone avec traitement audio réel
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface BreathDetectionResult {
  rpm: number; // Respirations par minute
  phase: 'inhale' | 'exhale' | 'pause' | 'unknown';
  amplitude: number; // 0-1
  consistency: number; // 0-100, régularité
  coherence: number; // 0-100, qualité du pattern
  timestamp: number;
}

export interface BreathSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  avgRpm: number;
  minRpm: number;
  maxRpm: number;
  coherenceScore: number;
  readings: BreathDetectionResult[];
  duration: number; // seconds
}

export interface BreathStats {
  totalSessions: number;
  totalMinutes: number;
  avgRpm: number;
  avgCoherence: number;
  bestCoherence: number;
  streak: number;
  weeklyTrend: number[];
  improvementRate: number;
}

const STORAGE_KEY = 'breath-mic-sessions';
const STATS_KEY = 'breath-mic-stats';

// Configuration audio
const AUDIO_CONFIG = {
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  minDecibels: -90,
  maxDecibels: -10,
  sampleRate: 44100,
  breathFrequencyMin: 0.1, // Hz (6 RPM)
  breathFrequencyMax: 0.5, // Hz (30 RPM)
};

export const useBreathMicEnriched = () => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentResult, setCurrentResult] = useState<BreathDetectionResult>({
    rpm: 0,
    phase: 'unknown',
    amplitude: 0,
    consistency: 0,
    coherence: 0,
    timestamp: Date.now()
  });
  const [session, setSession] = useState<BreathSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs pour l'audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Buffer pour le calcul RPM
  const amplitudeBufferRef = useRef<{ time: number; value: number }[]>([]);
  const lastPeakTimeRef = useRef<number>(0);
  const breathCyclesRef = useRef<number[]>([]);

  // Demander la permission du microphone
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (err) {
      logger.error('Mic permission denied', err as Error, 'BREATH');
      setHasPermission(false);
      setError('Permission microphone refusée');
      return false;
    }
  }, []);

  // Analyser le signal audio pour détecter la respiration
  const analyzeBreath = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeArray = new Float32Array(analyser.fftSize);

    const analyze = () => {
      if (!isListening) return;

      analyser.getByteFrequencyData(dataArray);
      analyser.getFloatTimeDomainData(timeArray);

      // Calculer l'amplitude moyenne (RMS)
      let sum = 0;
      for (let i = 0; i < timeArray.length; i++) {
        sum += timeArray[i] * timeArray[i];
      }
      const rms = Math.sqrt(sum / timeArray.length);
      const amplitude = Math.min(1, rms * 10); // Normaliser

      const now = Date.now();

      // Ajouter au buffer (garder 10 secondes de données)
      amplitudeBufferRef.current.push({ time: now, value: amplitude });
      amplitudeBufferRef.current = amplitudeBufferRef.current.filter(
        p => now - p.time < 10000
      );

      // Détecter les pics (inspirations)
      const buffer = amplitudeBufferRef.current;
      if (buffer.length > 10) {
        const recent = buffer.slice(-10);
        const avg = recent.reduce((s, p) => s + p.value, 0) / recent.length;
        const current = buffer[buffer.length - 1].value;
        const previous = buffer[buffer.length - 2]?.value || 0;

        // Détection de pic simple
        const isPeak = current > avg * 1.3 && current > previous;

        if (isPeak && now - lastPeakTimeRef.current > 1500) { // Min 1.5s entre pics
          const cycleTime = now - lastPeakTimeRef.current;
          lastPeakTimeRef.current = now;

          if (cycleTime > 0 && cycleTime < 15000) { // Max 15s par cycle
            breathCyclesRef.current.push(cycleTime);
            // Garder les 10 derniers cycles
            if (breathCyclesRef.current.length > 10) {
              breathCyclesRef.current.shift();
            }
          }
        }
      }

      // Calculer RPM basé sur les cycles détectés
      let rpm = 0;
      const cycles = breathCyclesRef.current;
      if (cycles.length >= 2) {
        const avgCycleMs = cycles.reduce((a, b) => a + b, 0) / cycles.length;
        rpm = Math.round(60000 / avgCycleMs);
        rpm = Math.max(4, Math.min(30, rpm)); // Clamp entre 4 et 30 RPM
      }

      // Détecter la phase
      let phase: 'inhale' | 'exhale' | 'pause' | 'unknown' = 'unknown';
      if (buffer.length >= 3) {
        const trend = buffer[buffer.length - 1].value - buffer[buffer.length - 3].value;
        if (trend > 0.05) phase = 'inhale';
        else if (trend < -0.05) phase = 'exhale';
        else phase = 'pause';
      }

      // Calculer la cohérence (régularité des cycles)
      let coherence = 0;
      if (cycles.length >= 3) {
        const mean = cycles.reduce((a, b) => a + b, 0) / cycles.length;
        const variance = cycles.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / cycles.length;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / mean; // Coefficient of variation
        coherence = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
      }

      // Calculer la consistance
      const consistency = cycles.length >= 3 ? Math.min(100, cycles.length * 15) : 0;

      const result: BreathDetectionResult = {
        rpm,
        phase,
        amplitude,
        consistency,
        coherence,
        timestamp: now
      };

      setCurrentResult(result);

      // Mettre à jour la session
      setSession(prev => {
        if (!prev) return prev;
        const readings = [...prev.readings, result].slice(-600); // Garder 10 minutes max
        return {
          ...prev,
          readings,
          avgRpm: readings.length > 0 
            ? Math.round(readings.reduce((s, r) => s + r.rpm, 0) / readings.length)
            : 0,
          minRpm: Math.min(...readings.map(r => r.rpm).filter(r => r > 0)),
          maxRpm: Math.max(...readings.map(r => r.rpm)),
          coherenceScore: readings.length > 0
            ? Math.round(readings.reduce((s, r) => s + r.coherence, 0) / readings.length)
            : 0,
          duration: Math.round((now - new Date(prev.startedAt).getTime()) / 1000)
        };
      });

      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  }, [isListening]);

  // Démarrer l'écoute
  const startListening = useCallback(async () => {
    try {
      setError(null);

      // Vérifier/demander permission
      if (hasPermission === null) {
        const granted = await requestPermission();
        if (!granted) return;
      } else if (!hasPermission) {
        toast.error('Permission microphone requise');
        return;
      }

      // Créer le contexte audio
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioContext = audioContextRef.current;

      // Obtenir le stream
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        }
      });

      // Créer l'analyseur
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = AUDIO_CONFIG.fftSize;
      analyserRef.current.smoothingTimeConstant = AUDIO_CONFIG.smoothingTimeConstant;
      analyserRef.current.minDecibels = AUDIO_CONFIG.minDecibels;
      analyserRef.current.maxDecibels = AUDIO_CONFIG.maxDecibels;

      // Connecter
      const source = audioContext.createMediaStreamSource(streamRef.current);
      source.connect(analyserRef.current);

      // Réinitialiser les buffers
      amplitudeBufferRef.current = [];
      breathCyclesRef.current = [];
      lastPeakTimeRef.current = Date.now();

      // Créer une nouvelle session
      setSession({
        id: `breath-${Date.now()}`,
        startedAt: new Date().toISOString(),
        avgRpm: 0,
        minRpm: 0,
        maxRpm: 0,
        coherenceScore: 0,
        readings: [],
        duration: 0
      });

      setIsListening(true);
      logger.info('Breath detection started', {}, 'BREATH');
      toast.success('Détection respiratoire activée');

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur microphone';
      setError(errorMsg);
      logger.error('Failed to start breath detection', err as Error, 'BREATH');
      toast.error(errorMsg);
    }
  }, [hasPermission, requestPermission]);

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsListening(false);

    // Sauvegarder la session
    if (session && session.readings.length > 0) {
      const completedSession = {
        ...session,
        endedAt: new Date().toISOString()
      };
      saveSession(completedSession);
      logger.info('Breath session saved', { duration: session.duration }, 'BREATH');
    }

    toast.success('Détection arrêtée');
  }, [session]);

  // Effet pour démarrer l'analyse
  useEffect(() => {
    if (isListening && analyserRef.current) {
      analyzeBreath();
    }
  }, [isListening, analyzeBreath]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Sauvegarder une session
  const saveSession = useCallback((sessionData: BreathSession) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const sessions: BreathSession[] = stored ? JSON.parse(stored) : [];
    sessions.unshift(sessionData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 100)));
    updateStats(sessionData);
  }, []);

  // Mettre à jour les stats
  const updateStats = useCallback((sessionData: BreathSession) => {
    const stored = localStorage.getItem(STATS_KEY);
    const stats: BreathStats = stored ? JSON.parse(stored) : {
      totalSessions: 0,
      totalMinutes: 0,
      avgRpm: 0,
      avgCoherence: 0,
      bestCoherence: 0,
      streak: 0,
      weeklyTrend: [0, 0, 0, 0, 0, 0, 0],
      improvementRate: 0
    };

    stats.totalSessions++;
    stats.totalMinutes += Math.round(sessionData.duration / 60);
    stats.avgRpm = Math.round((stats.avgRpm * (stats.totalSessions - 1) + sessionData.avgRpm) / stats.totalSessions);
    stats.avgCoherence = Math.round((stats.avgCoherence * (stats.totalSessions - 1) + sessionData.coherenceScore) / stats.totalSessions);
    stats.bestCoherence = Math.max(stats.bestCoherence, sessionData.coherenceScore);

    const dayOfWeek = new Date().getDay();
    stats.weeklyTrend[dayOfWeek]++;

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, []);

  // Obtenir les sessions
  const getSessions = useCallback((): BreathSession[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }, []);

  // Obtenir les stats
  const getStats = useCallback((): BreathStats => {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) return JSON.parse(stored);
    return {
      totalSessions: 0,
      totalMinutes: 0,
      avgRpm: 0,
      avgCoherence: 0,
      bestCoherence: 0,
      streak: 0,
      weeklyTrend: [0, 0, 0, 0, 0, 0, 0],
      improvementRate: 0
    };
  }, []);

  // Export des données
  const exportData = useCallback((format: 'json' | 'csv' = 'json'): string => {
    const sessions = getSessions();
    const stats = getStats();

    if (format === 'csv') {
      const headers = 'Session ID,Started,Ended,Duration (s),Avg RPM,Coherence\n';
      const rows = sessions.map(s =>
        `${s.id},${s.startedAt},${s.endedAt || ''},${s.duration},${s.avgRpm},${s.coherenceScore}`
      ).join('\n');
      return headers + rows;
    }

    return JSON.stringify({ sessions, stats }, null, 2);
  }, [getSessions, getStats]);

  return {
    // État actuel
    rpm: currentResult.rpm,
    phase: currentResult.phase,
    amplitude: currentResult.amplitude,
    coherence: currentResult.coherence,
    consistency: currentResult.consistency,

    // Contrôle
    isListening,
    startListening,
    stopListening,

    // Permission
    hasPermission,
    requestPermission,

    // Session courante
    session,

    // Historique & Stats
    getSessions,
    getStats,
    exportData,

    // Erreur
    error
  };
};

export default useBreathMicEnriched;
