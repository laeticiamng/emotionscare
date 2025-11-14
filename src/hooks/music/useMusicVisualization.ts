/**
 * useMusicVisualization Hook
 *
 * Hook pour analyse audio en temps réel et visualisation.
 *
 * Features:
 * - Analyse spectrale (FFT)
 * - Détection de beat (BPM)
 * - Extraction de features (énergie, centroid, etc.)
 * - Données pour visualisations (waveform, spectrum, etc.)
 *
 * @module hooks/music/useMusicVisualization
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

// ============================================
// TYPES
// ============================================

export interface AudioFeatures {
  rms: number;           // Root Mean Square (volume)
  energy: number;        // Énergie du signal
  zeroCrossingRate: number; // Taux de passage par zéro
  spectralCentroid: number; // Centre spectral
  spectralRolloff: number;  // Point de rolloff spectral
  spectralFlux: number;     // Flux spectral (changement)
}

export interface BeatDetection {
  bpm: number;
  confidence: number;
  beatTimes: number[];
  lastBeat: number;
}

export interface VisualizationData {
  waveform: Float32Array;
  spectrum: Uint8Array;
  features: AudioFeatures;
  beatDetection: BeatDetection | null;
}

export interface UseMusicVisualizationOptions {
  fftSize?: number;          // Taille FFT (256, 512, 1024, 2048, etc.)
  smoothingTimeConstant?: number; // 0-1, lissage
  minDecibels?: number;      // -100 à 0
  maxDecibels?: number;      // -100 à 0
  enableBeatDetection?: boolean;
}

export interface UseMusicVisualizationReturn {
  // État
  isAnalyzing: boolean;
  visualizationData: VisualizationData | null;

  // Contrôles
  startAnalysis: (audioElement: HTMLAudioElement) => void;
  stopAnalysis: () => void;
  reset: () => void;

  // Utilitaires
  getFrequencyData: () => Uint8Array | null;
  getTimeDomainData: () => Uint8Array | null;
  getAudioContext: () => AudioContext | null;
}

// ============================================
// HOOK
// ============================================

export function useMusicVisualization(
  options: UseMusicVisualizationOptions = {}
): UseMusicVisualizationReturn {
  const {
    fftSize = 2048,
    smoothingTimeConstant = 0.8,
    minDecibels = -90,
    maxDecibels = -10,
    enableBeatDetection = true
  } = options;

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const beatDetectorRef = useRef<BeatDetector | null>(null);

  // State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visualizationData, setVisualizationData] = useState<VisualizationData | null>(null);

  /**
   * Démarre l'analyse audio
   */
  const startAnalysis = useCallback((audioElement: HTMLAudioElement) => {
    try {
      // Créer AudioContext si nécessaire
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;

      // Créer l'analyser
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = fftSize;
        analyserRef.current.smoothingTimeConstant = smoothingTimeConstant;
        analyserRef.current.minDecibels = minDecibels;
        analyserRef.current.maxDecibels = maxDecibels;
      }

      // Connecter l'audio source
      if (!sourceRef.current) {
        sourceRef.current = audioContext.createMediaElementSource(audioElement);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);
      }

      // Initialiser beat detector
      if (enableBeatDetection && !beatDetectorRef.current) {
        beatDetectorRef.current = new BeatDetector(audioContext.sampleRate);
      }

      setIsAnalyzing(true);

      // Démarrer l'analyse frame par frame
      const analyze = () => {
        if (!analyserRef.current) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;

        // Frequency data
        const frequencyData = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(frequencyData);

        // Time domain data
        const timeDomainData = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(timeDomainData);

        // Convertir en Float32Array pour calculs
        const floatTimeDomain = new Float32Array(bufferLength);
        for (let i = 0; i < bufferLength; i++) {
          floatTimeDomain[i] = (timeDomainData[i] - 128) / 128;
        }

        // Calculer les features
        const features = calculateAudioFeatures(floatTimeDomain, frequencyData);

        // Détection de beat
        let beatDetection: BeatDetection | null = null;
        if (enableBeatDetection && beatDetectorRef.current) {
          beatDetection = beatDetectorRef.current.process(floatTimeDomain);
        }

        setVisualizationData({
          waveform: floatTimeDomain,
          spectrum: frequencyData,
          features,
          beatDetection
        });

        animationFrameRef.current = requestAnimationFrame(analyze);
      };

      analyze();

      logger.debug('Music visualization started', undefined, 'useMusicVisualization');
    } catch (error) {
      logger.error('Failed to start visualization', error as Error, 'useMusicVisualization');
    }
  }, [fftSize, smoothingTimeConstant, minDecibels, maxDecibels, enableBeatDetection]);

  /**
   * Arrête l'analyse
   */
  const stopAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsAnalyzing(false);
    logger.debug('Music visualization stopped', undefined, 'useMusicVisualization');
  }, []);

  /**
   * Reset complet
   */
  const reset = useCallback(() => {
    stopAnalysis();

    // Disconnect nodes
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    beatDetectorRef.current = null;
    setVisualizationData(null);

    logger.debug('Music visualization reset', undefined, 'useMusicVisualization');
  }, [stopAnalysis]);

  /**
   * Obtient les données de fréquence actuelles
   */
  const getFrequencyData = useCallback((): Uint8Array | null => {
    if (!analyserRef.current) return null;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const data = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(data);

    return data;
  }, []);

  /**
   * Obtient les données temporelles actuelles
   */
  const getTimeDomainData = useCallback((): Uint8Array | null => {
    if (!analyserRef.current) return null;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const data = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(data);

    return data;
  }, []);

  /**
   * Obtient l'AudioContext
   */
  const getAudioContext = useCallback((): AudioContext | null => {
    return audioContextRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return {
    isAnalyzing,
    visualizationData,
    startAnalysis,
    stopAnalysis,
    reset,
    getFrequencyData,
    getTimeDomainData,
    getAudioContext
  };
}

// ============================================
// AUDIO FEATURES CALCULATION
// ============================================

function calculateAudioFeatures(
  timeDomain: Float32Array,
  frequencyData: Uint8Array
): AudioFeatures {
  // RMS (Root Mean Square)
  let sumSquares = 0;
  for (let i = 0; i < timeDomain.length; i++) {
    sumSquares += timeDomain[i] * timeDomain[i];
  }
  const rms = Math.sqrt(sumSquares / timeDomain.length);

  // Energy
  const energy = sumSquares / timeDomain.length;

  // Zero Crossing Rate
  let zeroCrossings = 0;
  for (let i = 1; i < timeDomain.length; i++) {
    if (
      (timeDomain[i - 1] >= 0 && timeDomain[i] < 0) ||
      (timeDomain[i - 1] < 0 && timeDomain[i] >= 0)
    ) {
      zeroCrossings++;
    }
  }
  const zeroCrossingRate = zeroCrossings / timeDomain.length;

  // Spectral Centroid
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < frequencyData.length; i++) {
    numerator += i * frequencyData[i];
    denominator += frequencyData[i];
  }
  const spectralCentroid = denominator > 0 ? numerator / denominator : 0;

  // Spectral Rolloff (95% de l'énergie)
  let cumulativeSum = 0;
  const totalSum = frequencyData.reduce((sum, val) => sum + val, 0);
  const threshold = 0.95 * totalSum;
  let spectralRolloff = 0;
  for (let i = 0; i < frequencyData.length; i++) {
    cumulativeSum += frequencyData[i];
    if (cumulativeSum >= threshold) {
      spectralRolloff = i;
      break;
    }
  }

  // Spectral Flux (différence avec frame précédente)
  // Note: Simplified version, would need to store previous frame
  const spectralFlux = 0; // TODO: implement with frame history

  return {
    rms,
    energy,
    zeroCrossingRate,
    spectralCentroid,
    spectralRolloff,
    spectralFlux
  };
}

// ============================================
// BEAT DETECTOR
// ============================================

class BeatDetector {
  private beatHistory: number[] = [];
  private lastBeatTime = 0;
  private energyHistory: number[] = [];
  private readonly historySize = 43; // ~1 second at 44.1kHz / 1024
  private readonly beatThreshold = 1.3;

  constructor(private sampleRate: number) {}

  process(timeDomain: Float32Array): BeatDetection {
    const currentTime = performance.now();

    // Calculate instant energy
    let energy = 0;
    for (let i = 0; i < timeDomain.length; i++) {
      energy += timeDomain[i] * timeDomain[i];
    }

    this.energyHistory.push(energy);
    if (this.energyHistory.length > this.historySize) {
      this.energyHistory.shift();
    }

    // Calculate average energy
    const avgEnergy = this.energyHistory.reduce((sum, e) => sum + e, 0) / this.energyHistory.length;

    // Detect beat
    const isBeat = energy > avgEnergy * this.beatThreshold;

    if (isBeat && currentTime - this.lastBeatTime > 300) {
      // Min 300ms between beats (200 BPM max)
      this.beatHistory.push(currentTime);
      this.lastBeatTime = currentTime;

      // Keep only recent beats (last 4 seconds)
      this.beatHistory = this.beatHistory.filter(t => currentTime - t < 4000);
    }

    // Calculate BPM
    let bpm = 0;
    let confidence = 0;

    if (this.beatHistory.length >= 4) {
      const intervals: number[] = [];
      for (let i = 1; i < this.beatHistory.length; i++) {
        intervals.push(this.beatHistory[i] - this.beatHistory[i - 1]);
      }

      const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
      bpm = Math.round(60000 / avgInterval); // Convert ms to BPM

      // Calculate confidence based on interval consistency
      const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);
      confidence = Math.max(0, 1 - stdDev / avgInterval);
    }

    return {
      bpm,
      confidence,
      beatTimes: [...this.beatHistory],
      lastBeat: this.lastBeatTime
    };
  }
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Exemple 1: Visualisation basique
 *
 * ```tsx
 * function MusicPlayer() {
 *   const audioRef = useRef<HTMLAudioElement>(null);
 *   const {
 *     visualizationData,
 *     startAnalysis,
 *     stopAnalysis
 *   } = useMusicVisualization();
 *
 *   const handlePlay = () => {
 *     if (audioRef.current) {
 *       startAnalysis(audioRef.current);
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <audio ref={audioRef} onPlay={handlePlay} onPause={stopAnalysis} />
 *       {visualizationData && (
 *         <Spectrum data={visualizationData.spectrum} />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */

/**
 * Exemple 2: Beat detection
 *
 * ```tsx
 * function BeatVisualizer() {
 *   const { visualizationData } = useMusicVisualization({
 *     enableBeatDetection: true
 *   });
 *
 *   const beat = visualizationData?.beatDetection;
 *
 *   return (
 *     <div>
 *       {beat && (
 *         <>
 *           <div>BPM: {beat.bpm}</div>
 *           <div>Confidence: {(beat.confidence * 100).toFixed(0)}%</div>
 *         </>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
