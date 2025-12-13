// @ts-nocheck
import { useEffect, useState, useCallback, useRef } from 'react';

/** Configuration du micro respiratoire */
export interface BreathMicConfig {
  sampleRate: number;
  sensitivity: number;
  noiseThreshold: number;
  minBreathDuration: number;
  maxBreathDuration: number;
  alertOnIrregular: boolean;
  recordAudio: boolean;
}

/** Données respiratoires */
export interface BreathData {
  rpm: number;
  inhaleLength: number;
  exhaleLength: number;
  holdLength: number;
  amplitude: number;
  regularity: number;
  timestamp: Date;
}

/** Phase respiratoire */
export type BreathPhase = 'inhale' | 'hold_in' | 'exhale' | 'hold_out' | 'unknown';

/** Statistiques respiratoires */
export interface BreathStats {
  currentRPM: number;
  averageRPM: number;
  minRPM: number;
  maxRPM: number;
  averageInhaleLength: number;
  averageExhaleLength: number;
  inhaleExhaleRatio: number;
  regularity: number;
  breathCount: number;
  coherenceScore: number;
}

/** Pattern respiratoire détecté */
export interface BreathPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdOut: number;
  matchScore: number;
}

/** Alerte respiratoire */
export interface BreathAlert {
  type: 'fast' | 'slow' | 'irregular' | 'shallow';
  value: number;
  timestamp: Date;
  message: string;
}

const DEFAULT_CONFIG: BreathMicConfig = {
  sampleRate: 100,
  sensitivity: 0.5,
  noiseThreshold: 0.1,
  minBreathDuration: 2000,
  maxBreathDuration: 15000,
  alertOnIrregular: true,
  recordAudio: false
};

const BREATH_PATTERNS: Omit<BreathPattern, 'matchScore'>[] = [
  { name: 'Naturel', inhale: 4, hold: 0, exhale: 4, holdOut: 0 },
  { name: 'Cohérence', inhale: 5, hold: 0, exhale: 5, holdOut: 0 },
  { name: 'Relaxation', inhale: 4, hold: 0, exhale: 6, holdOut: 0 },
  { name: '4-7-8', inhale: 4, hold: 7, exhale: 8, holdOut: 0 },
  { name: 'Box', inhale: 4, hold: 4, exhale: 4, holdOut: 4 },
  { name: 'Énergisant', inhale: 2, hold: 0, exhale: 2, holdOut: 0 }
];

export const useBreathMic = (initialConfig?: Partial<BreathMicConfig>) => {
  const [config, setConfig] = useState<BreathMicConfig>({ ...DEFAULT_CONFIG, ...initialConfig });
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [rpm, setRpm] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('unknown');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [amplitude, setAmplitude] = useState(0);
  const [history, setHistory] = useState<BreathData[]>([]);
  const [alerts, setAlerts] = useState<BreathAlert[]>([]);
  const [detectedPattern, setDetectedPattern] = useState<BreathPattern | null>(null);
  const [stats, setStats] = useState<BreathStats>({
    currentRPM: 0,
    averageRPM: 0,
    minRPM: 0,
    maxRPM: 0,
    averageInhaleLength: 0,
    averageExhaleLength: 0,
    inhaleExhaleRatio: 1,
    regularity: 0,
    breathCount: 0,
    coherenceScore: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const historyRef = useRef<BreathData[]>([]);
  const phaseStartRef = useRef<number>(Date.now());
  const breathCycleRef = useRef<{ inhale: number; hold: number; exhale: number }[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simuler la détection respiratoire
  const generateSimulatedData = useCallback(() => {
    const now = Date.now();
    const cyclePosition = (now % 8000) / 8000; // Cycle de 8 secondes

    // Simuler les phases
    let phase: BreathPhase;
    let progress: number;
    let amp: number;

    if (cyclePosition < 0.4) {
      // Inhale (40% du cycle)
      phase = 'inhale';
      progress = cyclePosition / 0.4;
      amp = 0.3 + progress * 0.7;
    } else if (cyclePosition < 0.5) {
      // Hold (10% du cycle)
      phase = 'hold_in';
      progress = (cyclePosition - 0.4) / 0.1;
      amp = 1.0;
    } else if (cyclePosition < 0.9) {
      // Exhale (40% du cycle)
      phase = 'exhale';
      progress = (cyclePosition - 0.5) / 0.4;
      amp = 1.0 - progress * 0.7;
    } else {
      // Hold out (10% du cycle)
      phase = 'hold_out';
      progress = (cyclePosition - 0.9) / 0.1;
      amp = 0.3;
    }

    // Ajouter du bruit
    const noise = (Math.random() - 0.5) * 0.1;
    amp = Math.max(0, Math.min(1, amp + noise));

    // RPM avec variation
    const baseRPM = 60 / 8; // 7.5 RPM pour un cycle de 8s
    const rpmVariation = (Math.random() - 0.5) * 2;
    const newRPM = Math.round((baseRPM + rpmVariation) * 10) / 10;

    return { phase, progress, amplitude: amp, rpm: newRPM };
  }, []);

  // Calculer les statistiques
  const calculateStats = useCallback(() => {
    const recent = historyRef.current.slice(-60); // Dernière minute
    if (recent.length === 0) return;

    const rpms = recent.map(d => d.rpm);
    const inhales = recent.map(d => d.inhaleLength).filter(l => l > 0);
    const exhales = recent.map(d => d.exhaleLength).filter(l => l > 0);

    const avgRPM = rpms.reduce((a, b) => a + b, 0) / rpms.length;
    const avgInhale = inhales.length > 0 ? inhales.reduce((a, b) => a + b, 0) / inhales.length : 0;
    const avgExhale = exhales.length > 0 ? exhales.reduce((a, b) => a + b, 0) / exhales.length : 0;

    // Régularité basée sur l'écart-type du RPM
    const stdDev = Math.sqrt(rpms.reduce((sum, r) => sum + Math.pow(r - avgRPM, 2), 0) / rpms.length);
    const regularity = Math.max(0, 100 - stdDev * 10);

    // Score de cohérence (basé sur la régularité et le ratio inhale/exhale)
    const ratio = avgInhale > 0 && avgExhale > 0 ? avgInhale / avgExhale : 1;
    const idealRatio = 1.0; // Ratio idéal pour la cohérence
    const ratioScore = 100 - Math.abs(ratio - idealRatio) * 50;
    const coherenceScore = Math.round((regularity * 0.6 + ratioScore * 0.4));

    setStats({
      currentRPM: rpm,
      averageRPM: Math.round(avgRPM * 10) / 10,
      minRPM: Math.min(...rpms),
      maxRPM: Math.max(...rpms),
      averageInhaleLength: Math.round(avgInhale * 100) / 100,
      averageExhaleLength: Math.round(avgExhale * 100) / 100,
      inhaleExhaleRatio: Math.round(ratio * 100) / 100,
      regularity: Math.round(regularity),
      breathCount: historyRef.current.length,
      coherenceScore
    });
  }, [rpm]);

  // Détecter le pattern respiratoire
  const detectPattern = useCallback(() => {
    if (breathCycleRef.current.length < 3) return;

    const recent = breathCycleRef.current.slice(-5);
    const avgInhale = recent.reduce((s, c) => s + c.inhale, 0) / recent.length;
    const avgHold = recent.reduce((s, c) => s + c.hold, 0) / recent.length;
    const avgExhale = recent.reduce((s, c) => s + c.exhale, 0) / recent.length;

    let bestMatch: BreathPattern | null = null;
    let bestScore = 0;

    for (const pattern of BREATH_PATTERNS) {
      const inhaleMatch = 1 - Math.abs(avgInhale - pattern.inhale) / Math.max(avgInhale, pattern.inhale);
      const holdMatch = pattern.hold === 0 && avgHold < 1 ? 1 :
        1 - Math.abs(avgHold - pattern.hold) / Math.max(avgHold, pattern.hold, 1);
      const exhaleMatch = 1 - Math.abs(avgExhale - pattern.exhale) / Math.max(avgExhale, pattern.exhale);

      const score = Math.round((inhaleMatch + holdMatch + exhaleMatch) / 3 * 100);

      if (score > bestScore && score > 60) {
        bestScore = score;
        bestMatch = { ...pattern, matchScore: score };
      }
    }

    setDetectedPattern(bestMatch);
  }, []);

  // Vérifier les alertes
  const checkAlerts = useCallback((currentRPM: number) => {
    if (!config.alertOnIrregular) return;

    const newAlerts: BreathAlert[] = [];

    if (currentRPM > 20) {
      newAlerts.push({
        type: 'fast',
        value: currentRPM,
        timestamp: new Date(),
        message: `Respiration rapide détectée: ${currentRPM} RPM`
      });
    } else if (currentRPM < 6 && currentRPM > 0) {
      newAlerts.push({
        type: 'slow',
        value: currentRPM,
        timestamp: new Date(),
        message: `Respiration lente détectée: ${currentRPM} RPM`
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 50));
    }
  }, [config.alertOnIrregular]);

  // Demander la permission du micro
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
      return false;
    }
  }, []);

  // Démarrer l'écoute
  const startListening = useCallback(async () => {
    if (intervalRef.current) return;

    // En mode simulé pour l'instant
    setIsListening(true);
    phaseStartRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const data = generateSimulatedData();

      setRpm(data.rpm);
      setCurrentPhase(data.phase);
      setPhaseProgress(data.progress);
      setAmplitude(data.amplitude);

      // Enregistrer l'historique
      const breathData: BreathData = {
        rpm: data.rpm,
        inhaleLength: data.phase === 'inhale' ? 4 : 0,
        exhaleLength: data.phase === 'exhale' ? 4 : 0,
        holdLength: data.phase.includes('hold') ? 1 : 0,
        amplitude: data.amplitude,
        regularity: 80,
        timestamp: new Date()
      };

      historyRef.current = [...historyRef.current.slice(-300), breathData];
      setHistory([...historyRef.current]);

      calculateStats();
      detectPattern();
      checkAlerts(data.rpm);
    }, config.sampleRate);
  }, [config.sampleRate, generateSimulatedData, calculateStats, detectPattern, checkAlerts]);

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Réinitialiser
  const reset = useCallback(() => {
    historyRef.current = [];
    breathCycleRef.current = [];
    setHistory([]);
    setAlerts([]);
    setDetectedPattern(null);
    setStats({
      currentRPM: 0,
      averageRPM: 0,
      minRPM: 0,
      maxRPM: 0,
      averageInhaleLength: 0,
      averageExhaleLength: 0,
      inhaleExhaleRatio: 1,
      regularity: 0,
      breathCount: 0,
      coherenceScore: 0
    });
  }, []);

  // Exporter les données
  const exportData = useCallback((): string => {
    let csv = 'Timestamp,RPM,Phase,Amplitude,Regularity\n';
    for (const d of historyRef.current) {
      csv += `${d.timestamp.toISOString()},${d.rpm},${d.inhaleLength > 0 ? 'inhale' : 'exhale'},${d.amplitude},${d.regularity}\n`;
    }
    return csv;
  }, []);

  // Obtenir des recommandations
  const getRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];

    if (stats.averageRPM > 15) {
      recommendations.push('Essayez de ralentir votre respiration pour plus de calme');
    }
    if (stats.inhaleExhaleRatio < 0.8) {
      recommendations.push('Allongez légèrement vos inspirations');
    }
    if (stats.inhaleExhaleRatio > 1.2) {
      recommendations.push('Allongez vos expirations pour favoriser la relaxation');
    }
    if (stats.regularity < 60) {
      recommendations.push('Concentrez-vous sur un rythme plus régulier');
    }
    if (stats.coherenceScore < 50) {
      recommendations.push('Pratiquez la cohérence cardiaque (5 secondes inspire/expire)');
    }

    return recommendations;
  }, [stats]);

  // Mettre à jour la configuration
  const updateConfig = useCallback((updates: Partial<BreathMicConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopListening();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [stopListening]);

  // Auto-start simulé
  useEffect(() => {
    startListening();
    return () => stopListening();
  }, []);

  return {
    // État principal
    rpm,
    currentPhase,
    phaseProgress,
    amplitude,
    isListening,
    hasPermission,

    // Données
    history,
    alerts,
    stats,
    detectedPattern,
    config,

    // Actions
    requestPermission,
    startListening,
    stopListening,
    reset,
    exportData,
    updateConfig,

    // Utilitaires
    getRecommendations,

    // Constantes
    patterns: BREATH_PATTERNS
  };
};

export default useBreathMic;
