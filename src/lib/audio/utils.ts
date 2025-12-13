// @ts-nocheck
/**
 * Audio Utils - Utilitaires audio complets
 * Normalisation, crossfade, analyse et manipulation audio
 */

import { logger } from '@/lib/logger';

/** Type de courbe d'interpolation */
export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'exponential' | 'logarithmic';

/** Format audio */
export type AudioFormat = 'wav' | 'mp3' | 'ogg' | 'webm' | 'aac' | 'flac';

/** Configuration de crossfade */
export interface CrossfadeConfig {
  duration: number;
  easing: EasingFunction;
  steps: number;
  overlap: boolean;
}

/** Résultat d'analyse audio */
export interface AudioAnalysis {
  duration: number;
  sampleRate: number;
  channels: number;
  bitDepth: number;
  peakAmplitude: number;
  averageAmplitude: number;
  rmsLevel: number;
  dynamicRange: number;
  silenceRatio: number;
}

/** Configuration de normalisation */
export interface NormalizationConfig {
  targetPeak: number;
  targetLufs: number;
  limitCeiling: number;
  preserveDynamics: boolean;
}

/** État de lecture audio */
export interface PlaybackState {
  playing: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  loop: boolean;
  playbackRate: number;
}

/** Configuration par défaut */
const DEFAULT_CROSSFADE_CONFIG: CrossfadeConfig = {
  duration: 800,
  easing: 'easeInOut',
  steps: 16,
  overlap: true
};

const DEFAULT_NORMALIZATION_CONFIG: NormalizationConfig = {
  targetPeak: -1,
  targetLufs: -14,
  limitCeiling: -0.1,
  preserveDynamics: true
};

/** Limiter une valeur entre 0 et 1 */
export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Limiter une valeur entre min et max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Convertir dB en ratio linéaire */
export function dbToLinear(db: number): number {
  return Math.pow(10, db / 20);
}

/** Convertir ratio linéaire en dB */
export function linearToDb(linear: number): number {
  return 20 * Math.log10(Math.max(linear, 0.00001));
}

/** Fonctions d'easing */
export const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  exponential: (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  logarithmic: (t) => Math.log(1 + t * (Math.E - 1))
};

/** Appliquer une fonction d'easing */
export function applyEasing(t: number, easing: EasingFunction): number {
  const fn = easingFunctions[easing] || easingFunctions.linear;
  return clamp01(fn(t));
}

/** Interpoler entre deux valeurs */
export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * clamp01(t);
}

/** Crossfade entre deux volumes avec configuration */
export async function crossfadeVolumes(
  setA: (vol: number) => void,
  setB: (vol: number) => void,
  fromA: number = 1,
  toA: number = 0,
  fromB: number = 0,
  toB: number = 1,
  ms: number = 800,
  easing: EasingFunction = 'easeInOut'
): Promise<void> {
  const steps = 16;
  const dt = ms / steps;

  for (let i = 0; i <= steps; i++) {
    const t = applyEasing(i / steps, easing);
    setA(lerp(fromA, toA, t));
    setB(lerp(fromB, toB, t));
    await new Promise(r => setTimeout(r, dt));
  }
}

/** Crossfade avancé avec configuration complète */
export async function crossfadeAdvanced(
  sourceA: { setVolume: (v: number) => void; getVolume: () => number },
  sourceB: { setVolume: (v: number) => void; getVolume: () => number },
  config: Partial<CrossfadeConfig> = {}
): Promise<void> {
  const cfg = { ...DEFAULT_CROSSFADE_CONFIG, ...config };
  const dt = cfg.duration / cfg.steps;

  const startA = sourceA.getVolume();
  const startB = cfg.overlap ? sourceB.getVolume() : 0;

  for (let i = 0; i <= cfg.steps; i++) {
    const t = applyEasing(i / cfg.steps, cfg.easing);
    sourceA.setVolume(lerp(startA, 0, t));
    sourceB.setVolume(lerp(startB, 1, t));
    await new Promise(r => setTimeout(r, dt));
  }
}

/** Fade in progressif */
export async function fadeIn(
  setVolume: (v: number) => void,
  targetVolume: number = 1,
  duration: number = 500,
  easing: EasingFunction = 'easeOut'
): Promise<void> {
  const steps = Math.ceil(duration / 50);
  const dt = duration / steps;

  for (let i = 0; i <= steps; i++) {
    const t = applyEasing(i / steps, easing);
    setVolume(lerp(0, targetVolume, t));
    await new Promise(r => setTimeout(r, dt));
  }
}

/** Fade out progressif */
export async function fadeOut(
  setVolume: (v: number) => void,
  currentVolume: number = 1,
  duration: number = 500,
  easing: EasingFunction = 'easeIn'
): Promise<void> {
  const steps = Math.ceil(duration / 50);
  const dt = duration / steps;

  for (let i = 0; i <= steps; i++) {
    const t = applyEasing(i / steps, easing);
    setVolume(lerp(currentVolume, 0, t));
    await new Promise(r => setTimeout(r, dt));
  }
}

/** Analyser un buffer audio */
export function analyzeAudioBuffer(buffer: AudioBuffer): AudioAnalysis {
  const channelData = buffer.getChannelData(0);
  const { length, sampleRate, numberOfChannels } = buffer;

  let peak = 0;
  let sum = 0;
  let sumSquares = 0;
  let silentSamples = 0;
  const silenceThreshold = 0.001;

  for (let i = 0; i < channelData.length; i++) {
    const sample = Math.abs(channelData[i]);
    peak = Math.max(peak, sample);
    sum += sample;
    sumSquares += sample * sample;
    if (sample < silenceThreshold) silentSamples++;
  }

  const average = sum / length;
  const rms = Math.sqrt(sumSquares / length);

  return {
    duration: buffer.duration,
    sampleRate,
    channels: numberOfChannels,
    bitDepth: 32, // Float32
    peakAmplitude: peak,
    averageAmplitude: average,
    rmsLevel: rms,
    dynamicRange: linearToDb(peak) - linearToDb(rms),
    silenceRatio: silentSamples / length
  };
}

/** Calculer le niveau RMS d'un segment */
export function calculateRMS(samples: Float32Array): number {
  let sumSquares = 0;
  for (let i = 0; i < samples.length; i++) {
    sumSquares += samples[i] * samples[i];
  }
  return Math.sqrt(sumSquares / samples.length);
}

/** Calculer le niveau peak d'un segment */
export function calculatePeak(samples: Float32Array): number {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    peak = Math.max(peak, Math.abs(samples[i]));
  }
  return peak;
}

/** Normaliser un buffer audio */
export function normalizeBuffer(
  buffer: AudioBuffer,
  config: Partial<NormalizationConfig> = {}
): AudioBuffer {
  const cfg = { ...DEFAULT_NORMALIZATION_CONFIG, ...config };
  const targetLinear = dbToLinear(cfg.targetPeak);
  const ceilingLinear = dbToLinear(cfg.limitCeiling);

  // Trouver le peak actuel
  let currentPeak = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const channelData = buffer.getChannelData(c);
    currentPeak = Math.max(currentPeak, calculatePeak(channelData));
  }

  if (currentPeak === 0) return buffer;

  // Calculer le gain
  const gain = Math.min(targetLinear / currentPeak, ceilingLinear);

  // Appliquer le gain
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const channelData = buffer.getChannelData(c);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] *= gain;
    }
  }

  return buffer;
}

/** Appliquer un gain à un buffer */
export function applyGain(buffer: AudioBuffer, gainDb: number): AudioBuffer {
  const gainLinear = dbToLinear(gainDb);

  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const channelData = buffer.getChannelData(c);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] *= gainLinear;
    }
  }

  return buffer;
}

/** Inverser la phase d'un buffer */
export function invertPhase(buffer: AudioBuffer): AudioBuffer {
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const channelData = buffer.getChannelData(c);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] *= -1;
    }
  }
  return buffer;
}

/** Mixer plusieurs buffers audio */
export function mixBuffers(
  context: AudioContext,
  buffers: AudioBuffer[],
  gains: number[] = []
): AudioBuffer {
  if (buffers.length === 0) {
    throw new Error('No buffers to mix');
  }

  const maxLength = Math.max(...buffers.map(b => b.length));
  const maxChannels = Math.max(...buffers.map(b => b.numberOfChannels));
  const sampleRate = buffers[0].sampleRate;

  const output = context.createBuffer(maxChannels, maxLength, sampleRate);

  for (let c = 0; c < maxChannels; c++) {
    const outputData = output.getChannelData(c);

    for (let b = 0; b < buffers.length; b++) {
      const buffer = buffers[b];
      const gain = gains[b] ?? 1;
      const channelIndex = Math.min(c, buffer.numberOfChannels - 1);
      const inputData = buffer.getChannelData(channelIndex);

      for (let i = 0; i < inputData.length; i++) {
        outputData[i] += inputData[i] * gain;
      }
    }
  }

  return output;
}

/** Concaténer plusieurs buffers audio */
export function concatenateBuffers(
  context: AudioContext,
  buffers: AudioBuffer[],
  gap: number = 0
): AudioBuffer {
  if (buffers.length === 0) {
    throw new Error('No buffers to concatenate');
  }

  const sampleRate = buffers[0].sampleRate;
  const maxChannels = Math.max(...buffers.map(b => b.numberOfChannels));
  const gapSamples = Math.floor(gap * sampleRate);
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0) + gapSamples * (buffers.length - 1);

  const output = context.createBuffer(maxChannels, totalLength, sampleRate);

  let offset = 0;
  for (let b = 0; b < buffers.length; b++) {
    const buffer = buffers[b];

    for (let c = 0; c < maxChannels; c++) {
      const outputData = output.getChannelData(c);
      const channelIndex = Math.min(c, buffer.numberOfChannels - 1);
      const inputData = buffer.getChannelData(channelIndex);

      for (let i = 0; i < inputData.length; i++) {
        outputData[offset + i] = inputData[i];
      }
    }

    offset += buffer.length + gapSamples;
  }

  return output;
}

/** Extraire un segment d'un buffer */
export function extractSegment(
  context: AudioContext,
  buffer: AudioBuffer,
  startTime: number,
  endTime: number
): AudioBuffer {
  const startSample = Math.floor(startTime * buffer.sampleRate);
  const endSample = Math.floor(endTime * buffer.sampleRate);
  const length = endSample - startSample;

  const output = context.createBuffer(buffer.numberOfChannels, length, buffer.sampleRate);

  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const inputData = buffer.getChannelData(c);
    const outputData = output.getChannelData(c);

    for (let i = 0; i < length; i++) {
      outputData[i] = inputData[startSample + i] || 0;
    }
  }

  return output;
}

/** Détecter le silence au début/fin */
export function detectSilence(
  buffer: AudioBuffer,
  threshold: number = 0.01
): { start: number; end: number } {
  const channelData = buffer.getChannelData(0);
  let start = 0;
  let end = channelData.length - 1;

  // Trouver le début du contenu
  while (start < channelData.length && Math.abs(channelData[start]) < threshold) {
    start++;
  }

  // Trouver la fin du contenu
  while (end > start && Math.abs(channelData[end]) < threshold) {
    end--;
  }

  return {
    start: start / buffer.sampleRate,
    end: end / buffer.sampleRate
  };
}

/** Trimmer le silence d'un buffer */
export function trimSilence(
  context: AudioContext,
  buffer: AudioBuffer,
  threshold: number = 0.01
): AudioBuffer {
  const { start, end } = detectSilence(buffer, threshold);
  return extractSegment(context, buffer, start, end);
}

/** Créer un oscillateur avec envelope */
export function createOscillatorWithEnvelope(
  context: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  attack: number = 0.01,
  release: number = 0.1
): { oscillator: OscillatorNode; gain: GainNode } {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  const now = context.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(1, now + attack);
  gainNode.gain.setValueAtTime(1, now + duration - release);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);

  oscillator.connect(gainNode);

  return { oscillator, gain: gainNode };
}

/** Formater une durée en mm:ss */
export function formatAudioTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/** Formater une durée en hh:mm:ss */
export function formatAudioTimeLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/** Parser une durée formatée */
export function parseAudioTime(formatted: string): number {
  const parts = formatted.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

/** Vérifier le support des formats audio */
export function checkAudioFormatSupport(): Record<AudioFormat, boolean> {
  const audio = document.createElement('audio');

  return {
    wav: audio.canPlayType('audio/wav') !== '',
    mp3: audio.canPlayType('audio/mpeg') !== '',
    ogg: audio.canPlayType('audio/ogg') !== '',
    webm: audio.canPlayType('audio/webm') !== '',
    aac: audio.canPlayType('audio/aac') !== '',
    flac: audio.canPlayType('audio/flac') !== ''
  };
}

/** Obtenir le meilleur format supporté */
export function getBestSupportedFormat(): AudioFormat {
  const support = checkAudioFormatSupport();
  const preference: AudioFormat[] = ['webm', 'ogg', 'mp3', 'aac', 'wav', 'flac'];

  for (const format of preference) {
    if (support[format]) return format;
  }

  return 'mp3'; // Fallback
}

export default {
  clamp01,
  clamp,
  dbToLinear,
  linearToDb,
  applyEasing,
  lerp,
  crossfadeVolumes,
  crossfadeAdvanced,
  fadeIn,
  fadeOut,
  analyzeAudioBuffer,
  calculateRMS,
  calculatePeak,
  normalizeBuffer,
  applyGain,
  invertPhase,
  mixBuffers,
  concatenateBuffers,
  extractSegment,
  detectSilence,
  trimSilence,
  createOscillatorWithEnvelope,
  formatAudioTime,
  formatAudioTimeLong,
  parseAudioTime,
  checkAudioFormatSupport,
  getBestSupportedFormat
};
