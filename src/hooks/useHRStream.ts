// @ts-nocheck
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

/** Configuration du stream HR */
export interface HRStreamConfig {
  sampleRate: number;
  smoothingFactor: number;
  alertOnAbnormal: boolean;
  lowThreshold: number;
  highThreshold: number;
  recordHistory: boolean;
  historyDuration: number;
}

/** Données HR */
export interface HRData {
  hr: number;
  hrv: number;
  timestamp: Date;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  source: 'sensor' | 'camera' | 'simulated';
}

/** Statistiques HR */
export interface HRStats {
  currentHR: number;
  averageHR: number;
  minHR: number;
  maxHR: number;
  currentHRV: number;
  averageHRV: number;
  restingHR: number;
  stressLevel: number;
  recoveryScore: number;
  heartRateZone: 'rest' | 'fat_burn' | 'cardio' | 'peak';
}

/** Zone de fréquence cardiaque */
export interface HRZone {
  name: string;
  min: number;
  max: number;
  color: string;
  description: string;
}

/** Alerte HR */
export interface HRAlert {
  type: 'low' | 'high' | 'irregular' | 'stress';
  value: number;
  threshold: number;
  timestamp: Date;
  message: string;
}

const DEFAULT_CONFIG: HRStreamConfig = {
  sampleRate: 1000,
  smoothingFactor: 0.3,
  alertOnAbnormal: true,
  lowThreshold: 50,
  highThreshold: 120,
  recordHistory: true,
  historyDuration: 300000 // 5 minutes
};

const HR_ZONES: HRZone[] = [
  { name: 'Repos', min: 0, max: 60, color: '#4CAF50', description: 'Zone de repos' },
  { name: 'Brûle-graisse', min: 60, max: 70, color: '#8BC34A', description: 'Combustion des graisses optimale' },
  { name: 'Cardio', min: 70, max: 85, color: '#FF9800', description: 'Amélioration cardiovasculaire' },
  { name: 'Pic', min: 85, max: 100, color: '#F44336', description: 'Effort maximal' }
];

export const useHRStream = (initialConfig?: Partial<HRStreamConfig>) => {
  const [config, setConfig] = useState<HRStreamConfig>({ ...DEFAULT_CONFIG, ...initialConfig });
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hrPre, setHrPre] = useState(70);
  const [hr, setHr] = useState(70);
  const [hrv, setHrv] = useState(30);
  const [quality, setQuality] = useState<HRData['quality']>('good');
  const [source, setSource] = useState<HRData['source']>('simulated');
  const [history, setHistory] = useState<HRData[]>([]);
  const [alerts, setAlerts] = useState<HRAlert[]>([]);
  const [stats, setStats] = useState<HRStats>({
    currentHR: 70,
    averageHR: 70,
    minHR: 70,
    maxHR: 70,
    currentHRV: 30,
    averageHRV: 30,
    restingHR: 65,
    stressLevel: 0,
    recoveryScore: 100,
    heartRateZone: 'rest'
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const historyRef = useRef<HRData[]>([]);
  const smoothedHRRef = useRef(70);

  // Simuler les données HR (à remplacer par vraie connexion capteur)
  const generateSimulatedData = useCallback(() => {
    // Variation naturelle
    const baseHR = 70;
    const variation = Math.sin(Date.now() / 10000) * 5;
    const noise = (Math.random() - 0.5) * 4;
    const rawHR = baseHR + variation + noise;

    // Lissage exponentiel
    smoothedHRRef.current = smoothedHRRef.current * (1 - config.smoothingFactor) +
      rawHR * config.smoothingFactor;

    const newHR = Math.round(smoothedHRRef.current);

    // HRV basé sur HR (simplifié)
    const baseHRV = 50 - (newHR - 60) * 0.3;
    const hrvNoise = (Math.random() - 0.5) * 10;
    const newHRV = Math.max(10, Math.min(100, Math.round(baseHRV + hrvNoise)));

    return { hr: newHR, hrv: newHRV };
  }, [config.smoothingFactor]);

  // Calculer les statistiques
  const calculateStats = useCallback((newHR: number, newHRV: number) => {
    const recent = historyRef.current;
    if (recent.length === 0) return;

    const hrs = recent.map(d => d.hr);
    const hrvs = recent.map(d => d.hrv);

    const avgHR = Math.round(hrs.reduce((a, b) => a + b, 0) / hrs.length);
    const avgHRV = Math.round(hrvs.reduce((a, b) => a + b, 0) / hrvs.length);
    const minHR = Math.min(...hrs);
    const maxHR = Math.max(...hrs);

    // Niveau de stress basé sur HRV (inversement proportionnel)
    const stressLevel = Math.max(0, Math.min(100, Math.round(100 - newHRV)));

    // Score de récupération
    const recoveryScore = Math.max(0, Math.min(100, Math.round(newHRV * 1.5)));

    // Zone de fréquence cardiaque (% de FC max estimée à 220 - âge, on utilise 185 par défaut)
    const maxHREstimate = 185;
    const hrPercent = (newHR / maxHREstimate) * 100;
    let heartRateZone: HRStats['heartRateZone'] = 'rest';
    if (hrPercent >= 85) heartRateZone = 'peak';
    else if (hrPercent >= 70) heartRateZone = 'cardio';
    else if (hrPercent >= 60) heartRateZone = 'fat_burn';

    setStats({
      currentHR: newHR,
      averageHR: avgHR,
      minHR,
      maxHR,
      currentHRV: newHRV,
      averageHRV: avgHRV,
      restingHR: Math.min(minHR, 65),
      stressLevel,
      recoveryScore,
      heartRateZone
    });
  }, []);

  // Vérifier les alertes
  const checkAlerts = useCallback((newHR: number) => {
    if (!config.alertOnAbnormal) return;

    const newAlerts: HRAlert[] = [];

    if (newHR < config.lowThreshold) {
      newAlerts.push({
        type: 'low',
        value: newHR,
        threshold: config.lowThreshold,
        timestamp: new Date(),
        message: `Fréquence cardiaque basse détectée: ${newHR} bpm`
      });
    }

    if (newHR > config.highThreshold) {
      newAlerts.push({
        type: 'high',
        value: newHR,
        threshold: config.highThreshold,
        timestamp: new Date(),
        message: `Fréquence cardiaque élevée détectée: ${newHR} bpm`
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 50));
    }
  }, [config.alertOnAbnormal, config.lowThreshold, config.highThreshold]);

  // Démarrer le stream
  const startStream = useCallback(() => {
    if (intervalRef.current) return;

    setIsConnected(true);
    smoothedHRRef.current = hr;

    intervalRef.current = setInterval(() => {
      const { hr: newHR, hrv: newHRV } = generateSimulatedData();

      setHr(newHR);
      setHrv(newHRV);
      setQuality(newHRV > 40 ? 'excellent' : newHRV > 25 ? 'good' : newHRV > 15 ? 'fair' : 'poor');

      // Historique
      if (config.recordHistory) {
        const dataPoint: HRData = {
          hr: newHR,
          hrv: newHRV,
          timestamp: new Date(),
          quality: newHRV > 40 ? 'excellent' : newHRV > 25 ? 'good' : newHRV > 15 ? 'fair' : 'poor',
          source
        };

        historyRef.current = [...historyRef.current, dataPoint]
          .filter(d => Date.now() - d.timestamp.getTime() < config.historyDuration);

        setHistory([...historyRef.current]);
      }

      calculateStats(newHR, newHRV);
      checkAlerts(newHR);
    }, config.sampleRate);
  }, [hr, source, config, generateSimulatedData, calculateStats, checkAlerts]);

  // Arrêter le stream
  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Démarrer l'enregistrement
  const startRecording = useCallback(async () => {
    setIsRecording(true);
    historyRef.current = [];
    setHistory([]);
    if (!isConnected) startStream();
  }, [isConnected, startStream]);

  // Arrêter l'enregistrement et sauvegarder
  const stopRecording = useCallback(async (): Promise<boolean> => {
    setIsRecording(false);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id || historyRef.current.length === 0) return false;

      const summary = {
        duration: config.historyDuration,
        samples: historyRef.current.length,
        avgHR: stats.averageHR,
        avgHRV: stats.averageHRV,
        minHR: stats.minHR,
        maxHR: stats.maxHR,
        data: historyRef.current.map(d => ({
          hr: d.hr,
          hrv: d.hrv,
          ts: d.timestamp.getTime()
        }))
      };

      await supabase.from('hr_recordings').insert({
        user_id: userData.user.id,
        summary,
        recorded_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error saving HR recording:', error);
      return false;
    }
  }, [config.historyDuration, stats]);

  // Obtenir le HR initial (pré-activité)
  const capturePreHR = useCallback(() => {
    setHrPre(hr);
    return hr;
  }, [hr]);

  // Calculer le delta HR
  const getHRDelta = useCallback(() => {
    return hr - hrPre;
  }, [hr, hrPre]);

  // Obtenir la zone actuelle
  const getCurrentZone = useCallback((): HRZone => {
    const maxHREstimate = 185;
    const hrPercent = (hr / maxHREstimate) * 100;

    for (const zone of HR_ZONES.slice().reverse()) {
      if (hrPercent >= zone.min) return zone;
    }
    return HR_ZONES[0];
  }, [hr]);

  // Exporter les données
  const exportData = useCallback((): string => {
    let csv = 'Timestamp,HR,HRV,Quality\n';
    for (const d of historyRef.current) {
      csv += `${d.timestamp.toISOString()},${d.hr},${d.hrv},${d.quality}\n`;
    }
    return csv;
  }, []);

  // Effacer les alertes
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Mettre à jour la configuration
  const updateConfig = useCallback((updates: Partial<HRStreamConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Auto-start simulé au montage
  useEffect(() => {
    startStream();
    return () => stopStream();
  }, []);

  return {
    // État principal
    hr,
    hrPre,
    hrv,
    quality,
    source,
    isConnected,
    isRecording,

    // Données historiques
    history,
    alerts,
    stats,
    config,

    // Actions stream
    startStream,
    stopStream,
    startRecording,
    stopRecording,

    // Utilitaires
    capturePreHR,
    getHRDelta,
    getCurrentZone,
    exportData,
    clearAlerts,
    updateConfig,

    // Constantes
    zones: HR_ZONES
  };
};

export default useHRStream;
