// @ts-nocheck
/**
 * audioVad - Voice Activity Detection pour l'audio
 * Détection de la voix, analyse et traitement audio temps réel
 */

import { logger } from '@/lib/logger';

/** État VAD */
export type VADState = 'idle' | 'listening' | 'speaking' | 'paused' | 'error';

/** Événement VAD */
export type VADEvent = 'speechStart' | 'speechEnd' | 'speaking' | 'silence' | 'error' | 'stateChange';

/** Configuration VAD */
export interface VADConfig {
  fftSize: number;
  smoothingTimeConstant: number;
  minDecibels: number;
  maxDecibels: number;
  energyThreshold: number;
  silenceThreshold: number;
  speechMinDuration: number;
  silenceMinDuration: number;
  sampleRate: number;
  channels: number;
  autoGainControl: boolean;
  noiseSuppression: boolean;
  echoCancellation: boolean;
}

/** Résultat d'analyse VAD */
export interface VADAnalysis {
  isSpeaking: boolean;
  energy: number;
  frequency: number;
  spectralCentroid: number;
  zeroCrossingRate: number;
  timestamp: number;
}

/** Stats VAD */
export interface VADStats {
  totalSpeechTime: number;
  totalSilenceTime: number;
  speechSegments: number;
  averageEnergy: number;
  peakEnergy: number;
  lastSpeechStart: number | null;
  lastSpeechEnd: number | null;
}

/** Callback pour événements */
export type VADCallback = (event: VADEvent, data?: unknown) => void;

const DEFAULT_CONFIG: VADConfig = {
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  minDecibels: -90,
  maxDecibels: -10,
  energyThreshold: 0.01,
  silenceThreshold: 0.005,
  speechMinDuration: 200,
  silenceMinDuration: 500,
  sampleRate: 44100,
  channels: 1,
  autoGainControl: true,
  noiseSuppression: true,
  echoCancellation: true
};

/** Créer un processeur audio basique */
export const createProcessor = (audioContext: AudioContext): ScriptProcessorNode => {
  const processor = audioContext.createScriptProcessor(4096, 1, 1);

  processor.onaudioprocess = (e) => {
    const inputData = e.inputBuffer.getChannelData(0);
    logger.debug('Processing audio data', { length: inputData.length }, 'VAD');
  };

  return processor;
};

/** Classe principale VAD */
export class VoiceActivityDetector {
  private config: VADConfig;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private state: VADState = 'idle';
  private callbacks: Map<VADEvent, VADCallback[]> = new Map();
  private animationFrame: number | null = null;
  private lastSpeaking: boolean = false;
  private speechStartTime: number | null = null;
  private silenceStartTime: number | null = null;
  private stats: VADStats;
  private energyHistory: number[] = [];
  private readonly historySize = 50;

  constructor(config: Partial<VADConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.stats = {
      totalSpeechTime: 0,
      totalSilenceTime: 0,
      speechSegments: 0,
      averageEnergy: 0,
      peakEnergy: 0,
      lastSpeechStart: null,
      lastSpeechEnd: null
    };
  }

  /** Obtenir l'état actuel */
  getState(): VADState {
    return this.state;
  }

  /** Obtenir les stats */
  getStats(): VADStats {
    return { ...this.stats };
  }

  /** S'abonner à un événement */
  on(event: VADEvent, callback: VADCallback): () => void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);

    return () => {
      const cbs = this.callbacks.get(event);
      if (cbs) {
        const idx = cbs.indexOf(callback);
        if (idx > -1) cbs.splice(idx, 1);
      }
    };
  }

  /** Émettre un événement */
  private emit(event: VADEvent, data?: unknown): void {
    const cbs = this.callbacks.get(event);
    if (cbs) {
      cbs.forEach(cb => cb(event, data));
    }
  }

  /** Changer l'état */
  private setState(newState: VADState): void {
    if (this.state !== newState) {
      const oldState = this.state;
      this.state = newState;
      this.emit('stateChange', { from: oldState, to: newState });
      logger.debug('VAD state changed', { from: oldState, to: newState }, 'VAD');
    }
  }

  /** Démarrer la détection */
  async start(): Promise<void> {
    if (this.state === 'listening' || this.state === 'speaking') {
      logger.warn('VAD already running', {}, 'VAD');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: this.config.echoCancellation,
          noiseSuppression: this.config.noiseSuppression,
          autoGainControl: this.config.autoGainControl,
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channels
        }
      });

      this.audioContext = new AudioContext({
        sampleRate: this.config.sampleRate
      });

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.config.fftSize;
      this.analyser.smoothingTimeConstant = this.config.smoothingTimeConstant;
      this.analyser.minDecibels = this.config.minDecibels;
      this.analyser.maxDecibels = this.config.maxDecibels;

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.source.connect(this.analyser);

      this.setState('listening');
      this.startAnalysis();

      logger.info('VAD started', { config: this.config }, 'VAD');
    } catch (error) {
      this.setState('error');
      this.emit('error', error);
      logger.error('Failed to start VAD', error as Error, 'VAD');
      throw error;
    }
  }

  /** Arrêter la détection */
  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.setState('idle');

    logger.info('VAD stopped', { stats: this.stats }, 'VAD');
  }

  /** Mettre en pause */
  pause(): void {
    if (this.state !== 'listening' && this.state !== 'speaking') return;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    this.setState('paused');
  }

  /** Reprendre */
  resume(): void {
    if (this.state !== 'paused') return;

    this.setState('listening');
    this.startAnalysis();
  }

  /** Démarrer l'analyse continue */
  private startAnalysis(): void {
    const analyze = () => {
      if (this.state !== 'listening' && this.state !== 'speaking') return;

      const analysis = this.analyze();

      if (analysis.isSpeaking && !this.lastSpeaking) {
        // Début de la parole
        const now = Date.now();
        if (this.silenceStartTime) {
          const silenceDuration = now - this.silenceStartTime;
          if (silenceDuration >= this.config.silenceMinDuration) {
            this.stats.totalSilenceTime += silenceDuration;
          }
          this.silenceStartTime = null;
        }

        this.speechStartTime = now;
        this.stats.lastSpeechStart = now;
        this.setState('speaking');
        this.emit('speechStart', analysis);
      } else if (!analysis.isSpeaking && this.lastSpeaking) {
        // Fin de la parole
        const now = Date.now();
        if (this.speechStartTime) {
          const speechDuration = now - this.speechStartTime;
          if (speechDuration >= this.config.speechMinDuration) {
            this.stats.totalSpeechTime += speechDuration;
            this.stats.speechSegments++;
            this.stats.lastSpeechEnd = now;
          }
          this.speechStartTime = null;
        }

        this.silenceStartTime = now;
        this.setState('listening');
        this.emit('speechEnd', analysis);
      } else if (analysis.isSpeaking) {
        this.emit('speaking', analysis);
      } else {
        this.emit('silence', analysis);
      }

      this.lastSpeaking = analysis.isSpeaking;
      this.animationFrame = requestAnimationFrame(analyze);
    };

    this.animationFrame = requestAnimationFrame(analyze);
  }

  /** Analyser le flux audio actuel */
  analyze(): VADAnalysis {
    if (!this.analyser) {
      return {
        isSpeaking: false,
        energy: 0,
        frequency: 0,
        spectralCentroid: 0,
        zeroCrossingRate: 0,
        timestamp: Date.now()
      };
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    const freqData = new Uint8Array(bufferLength);

    this.analyser.getByteTimeDomainData(timeData);
    this.analyser.getByteFrequencyData(freqData);

    // Calculer l'énergie RMS
    let sumSquares = 0;
    for (let i = 0; i < timeData.length; i++) {
      const normalized = (timeData[i] - 128) / 128;
      sumSquares += normalized * normalized;
    }
    const energy = Math.sqrt(sumSquares / timeData.length);

    // Mettre à jour l'historique
    this.energyHistory.push(energy);
    if (this.energyHistory.length > this.historySize) {
      this.energyHistory.shift();
    }

    // Mettre à jour les stats
    this.stats.averageEnergy = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    this.stats.peakEnergy = Math.max(this.stats.peakEnergy, energy);

    // Calculer le zero crossing rate
    let zeroCrossings = 0;
    for (let i = 1; i < timeData.length; i++) {
      if ((timeData[i] >= 128) !== (timeData[i - 1] >= 128)) {
        zeroCrossings++;
      }
    }
    const zeroCrossingRate = zeroCrossings / timeData.length;

    // Calculer le spectral centroid
    let weightedSum = 0;
    let sum = 0;
    for (let i = 0; i < freqData.length; i++) {
      weightedSum += i * freqData[i];
      sum += freqData[i];
    }
    const spectralCentroid = sum > 0 ? weightedSum / sum : 0;

    // Trouver la fréquence dominante
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < freqData.length; i++) {
      if (freqData[i] > maxValue) {
        maxValue = freqData[i];
        maxIndex = i;
      }
    }
    const frequency = maxIndex * (this.config.sampleRate / 2) / bufferLength;

    // Déterminer si c'est de la parole
    const isSpeaking = energy > this.config.energyThreshold &&
      zeroCrossingRate > 0.1 &&
      zeroCrossingRate < 0.5 &&
      frequency > 85 && frequency < 3000;

    return {
      isSpeaking,
      energy,
      frequency,
      spectralCentroid,
      zeroCrossingRate,
      timestamp: Date.now()
    };
  }

  /** Obtenir le niveau actuel en dB */
  getLevel(): number {
    if (!this.analyser) return -Infinity;

    const freqData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(freqData);

    let sum = 0;
    for (let i = 0; i < freqData.length; i++) {
      sum += freqData[i];
    }

    const average = sum / freqData.length;
    return average > 0 ? 20 * Math.log10(average / 255) : -Infinity;
  }

  /** Obtenir les données de fréquence */
  getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);

    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  /** Obtenir les données temporelles */
  getTimeDomainData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);

    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  /** Réinitialiser les stats */
  resetStats(): void {
    this.stats = {
      totalSpeechTime: 0,
      totalSilenceTime: 0,
      speechSegments: 0,
      averageEnergy: 0,
      peakEnergy: 0,
      lastSpeechStart: null,
      lastSpeechEnd: null
    };
    this.energyHistory = [];
  }

  /** Mettre à jour la configuration */
  updateConfig(newConfig: Partial<VADConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (this.analyser) {
      if (newConfig.fftSize) this.analyser.fftSize = newConfig.fftSize;
      if (newConfig.smoothingTimeConstant !== undefined) {
        this.analyser.smoothingTimeConstant = newConfig.smoothingTimeConstant;
      }
      if (newConfig.minDecibels !== undefined) {
        this.analyser.minDecibels = newConfig.minDecibels;
      }
      if (newConfig.maxDecibels !== undefined) {
        this.analyser.maxDecibels = newConfig.maxDecibels;
      }
    }
  }
}

/** Créer une instance VAD */
export function createVAD(config?: Partial<VADConfig>): VoiceActivityDetector {
  return new VoiceActivityDetector(config);
}

/** Vérifier le support du microphone */
export async function checkMicrophoneSupport(): Promise<{
  supported: boolean;
  permissions: PermissionState | null;
  devices: MediaDeviceInfo[];
}> {
  const result = {
    supported: false,
    permissions: null as PermissionState | null,
    devices: [] as MediaDeviceInfo[]
  };

  if (!navigator.mediaDevices?.getUserMedia) {
    return result;
  }

  result.supported = true;

  try {
    const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    result.permissions = permission.state;
  } catch {
    // Permissions API not supported
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    result.devices = devices.filter(d => d.kind === 'audioinput');
  } catch {
    // Cannot enumerate devices
  }

  return result;
}

export default {
  createProcessor,
  createVAD,
  VoiceActivityDetector,
  checkMicrophoneSupport
};
