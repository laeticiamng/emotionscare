// @ts-nocheck
/**
 * audioVadEnriched - Voice Activity Detection réel avec analyse audio
 */

import { logger } from '@/lib/logger';

export interface VADConfig {
  fftSize: number;
  smoothingTimeConstant: number;
  minDecibels: number;
  maxDecibels: number;
  energyThreshold: number;
  zeroCrossingThreshold: number;
  silenceDuration: number; // ms avant de considérer comme silence
  speechDuration: number; // ms minimum pour considérer comme parole
}

export interface VADResult {
  isSpeech: boolean;
  confidence: number; // 0-1
  energy: number; // 0-1
  zeroCrossingRate: number;
  spectralCentroid: number;
  duration: number; // ms depuis le début de l'activité
}

export interface VADStats {
  totalSpeechMs: number;
  totalSilenceMs: number;
  speechSegments: number;
  avgSpeechDuration: number;
  avgConfidence: number;
}

const DEFAULT_CONFIG: VADConfig = {
  fftSize: 2048,
  smoothingTimeConstant: 0.85,
  minDecibels: -90,
  maxDecibels: -10,
  energyThreshold: 0.02,
  zeroCrossingThreshold: 0.3,
  silenceDuration: 300,
  speechDuration: 100
};

export class VoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private config: VADConfig;

  private isRunning = false;
  private lastSpeechTime = 0;
  private lastSilenceTime = 0;
  private speechStartTime = 0;
  private isSpeaking = false;

  private frequencyData: Uint8Array | null = null;
  private timeData: Float32Array | null = null;

  private onSpeechStart?: () => void;
  private onSpeechEnd?: () => void;
  private onResult?: (result: VADResult) => void;

  private stats: VADStats = {
    totalSpeechMs: 0,
    totalSilenceMs: 0,
    speechSegments: 0,
    avgSpeechDuration: 0,
    avgConfidence: 0
  };

  constructor(config: Partial<VADConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Démarrer la détection
  async start(callbacks: {
    onSpeechStart?: () => void;
    onSpeechEnd?: () => void;
    onResult?: (result: VADResult) => void;
  }): Promise<boolean> {
    try {
      this.onSpeechStart = callbacks.onSpeechStart;
      this.onSpeechEnd = callbacks.onSpeechEnd;
      this.onResult = callbacks.onResult;

      // Demander le microphone
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Créer le contexte audio
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Créer l'analyseur
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.config.fftSize;
      this.analyser.smoothingTimeConstant = this.config.smoothingTimeConstant;
      this.analyser.minDecibels = this.config.minDecibels;
      this.analyser.maxDecibels = this.config.maxDecibels;

      // Connecter la source
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.source.connect(this.analyser);

      // Initialiser les buffers
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeData = new Float32Array(this.analyser.fftSize);

      this.isRunning = true;
      this.processAudio();

      logger.info('VAD started', {}, 'AUDIO');
      return true;

    } catch (error) {
      logger.error('Failed to start VAD', error as Error, 'AUDIO');
      return false;
    }
  }

  // Arrêter la détection
  stop(): void {
    this.isRunning = false;

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.source = null;

    logger.info('VAD stopped', { stats: this.stats }, 'AUDIO');
  }

  // Traitement audio en boucle
  private processAudio(): void {
    if (!this.isRunning || !this.analyser || !this.frequencyData || !this.timeData) {
      return;
    }

    // Récupérer les données
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getFloatTimeDomainData(this.timeData);

    // Calculer les features
    const energy = this.calculateEnergy(this.timeData);
    const zcr = this.calculateZeroCrossingRate(this.timeData);
    const spectralCentroid = this.calculateSpectralCentroid(this.frequencyData);

    // Détection de parole
    const now = Date.now();
    const isSpeechDetected = this.detectSpeech(energy, zcr, spectralCentroid);

    // Calculer la confiance
    const confidence = this.calculateConfidence(energy, zcr, spectralCentroid);

    // Gestion des transitions
    if (isSpeechDetected) {
      if (!this.isSpeaking) {
        // Vérifier la durée minimum
        if (this.lastSilenceTime === 0 || now - this.lastSilenceTime > this.config.speechDuration) {
          this.isSpeaking = true;
          this.speechStartTime = now;
          this.stats.speechSegments++;
          this.onSpeechStart?.();
        }
      }
      this.lastSpeechTime = now;
    } else {
      if (this.isSpeaking) {
        // Vérifier la durée de silence
        if (now - this.lastSpeechTime > this.config.silenceDuration) {
          this.isSpeaking = false;
          const speechDuration = now - this.speechStartTime;
          this.stats.totalSpeechMs += speechDuration;
          this.stats.avgSpeechDuration = this.stats.totalSpeechMs / this.stats.speechSegments;
          this.onSpeechEnd?.();
        }
      }
      this.lastSilenceTime = now;
      this.stats.totalSilenceMs += 16; // ~60fps
    }

    // Mettre à jour les stats
    this.stats.avgConfidence = (this.stats.avgConfidence * 0.95) + (confidence * 0.05);

    // Envoyer le résultat
    const result: VADResult = {
      isSpeech: this.isSpeaking,
      confidence,
      energy,
      zeroCrossingRate: zcr,
      spectralCentroid,
      duration: this.isSpeaking ? now - this.speechStartTime : 0
    };

    this.onResult?.(result);

    // Continuer la boucle
    requestAnimationFrame(() => this.processAudio());
  }

  // Calculer l'énergie RMS
  private calculateEnergy(timeData: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < timeData.length; i++) {
      sum += timeData[i] * timeData[i];
    }
    return Math.sqrt(sum / timeData.length);
  }

  // Calculer le taux de passages par zéro
  private calculateZeroCrossingRate(timeData: Float32Array): number {
    let crossings = 0;
    for (let i = 1; i < timeData.length; i++) {
      if ((timeData[i - 1] >= 0 && timeData[i] < 0) || (timeData[i - 1] < 0 && timeData[i] >= 0)) {
        crossings++;
      }
    }
    return crossings / timeData.length;
  }

  // Calculer le centroïde spectral
  private calculateSpectralCentroid(frequencyData: Uint8Array): number {
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      const magnitude = frequencyData[i];
      numerator += i * magnitude;
      denominator += magnitude;
    }

    return denominator > 0 ? numerator / denominator : 0;
  }

  // Détecter la parole
  private detectSpeech(energy: number, zcr: number, spectralCentroid: number): boolean {
    // Seuils adaptatifs basés sur les caractéristiques de la parole
    const energyAboveThreshold = energy > this.config.energyThreshold;

    // La parole a généralement un ZCR modéré (pas trop élevé comme le bruit)
    const zcrInRange = zcr > 0.05 && zcr < this.config.zeroCrossingThreshold;

    // Le centroïde spectral pour la parole est généralement dans une certaine plage
    const centroidInRange = spectralCentroid > 20 && spectralCentroid < 200;

    return energyAboveThreshold && (zcrInRange || centroidInRange);
  }

  // Calculer la confiance
  private calculateConfidence(energy: number, zcr: number, spectralCentroid: number): number {
    let confidence = 0;

    // Énergie contribue à 40%
    if (energy > this.config.energyThreshold) {
      confidence += Math.min(0.4, (energy / 0.1) * 0.4);
    }

    // ZCR contribue à 30%
    if (zcr > 0.05 && zcr < this.config.zeroCrossingThreshold) {
      confidence += 0.3;
    }

    // Centroïde spectral contribue à 30%
    if (spectralCentroid > 20 && spectralCentroid < 200) {
      confidence += 0.3;
    }

    return Math.min(1, confidence);
  }

  // Obtenir les statistiques
  getStats(): VADStats {
    return { ...this.stats };
  }

  // Réinitialiser les statistiques
  resetStats(): void {
    this.stats = {
      totalSpeechMs: 0,
      totalSilenceMs: 0,
      speechSegments: 0,
      avgSpeechDuration: 0,
      avgConfidence: 0
    };
  }

  // État actuel
  isActive(): boolean {
    return this.isRunning;
  }

  isSpeakingNow(): boolean {
    return this.isSpeaking;
  }
}

// Factory function pour rétrocompatibilité
export const createProcessor = (audioContext: AudioContext): ScriptProcessorNode => {
  const processor = audioContext.createScriptProcessor(4096, 1, 1);
  const vad = new VoiceActivityDetector();

  processor.onaudioprocess = (e) => {
    const inputData = e.inputBuffer.getChannelData(0);

    // Calculer l'énergie
    let sum = 0;
    for (let i = 0; i < inputData.length; i++) {
      sum += inputData[i] * inputData[i];
    }
    const energy = Math.sqrt(sum / inputData.length);

    // Logger si activité détectée
    if (energy > 0.01) {
      logger.debug('Audio activity detected', { energy }, 'AUDIO');
    }
  };

  return processor;
};

export default VoiceActivityDetector;
