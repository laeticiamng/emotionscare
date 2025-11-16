// @ts-nocheck
/**
 * Service de détection d'émotions/mood en temps réel
 *
 * Utilise:
 * - Web Audio API pour l'analyse audio
 * - Analyse spectrale pour détecter les caractéristiques musicales
 * - Apprentissage automatique pour mapper aux moods
 * - Caméra optionnelle pour analyse faciale (Hume AI ou MediaPipe)
 */

import { logger } from '@/lib/logger';

// ============================================
// TYPES
// ============================================

export type MoodDetectionSource = 'audio' | 'face' | 'combined';
export type Mood = 'happy' | 'sad' | 'energetic' | 'calm' | 'focused' | 'relaxed';

export interface MoodDetectionResult {
  mood: Mood;
  confidence: number;
  alternatives: { mood: Mood; confidence: number }[];
  source: MoodDetectionSource;
  timestamp: number;
  details: {
    energy?: number;
    valence?: number;
    arousal?: number;
    dominance?: number;
  };
}

export interface AudioAnalysisFeatures {
  energy: number;
  valence: number;
  arousal: number;
  dominance: number;
  spectralCentroid: number;
  zeroCrossingRate: number;
  mfcc: number[];
}

// ============================================
// MOOD DETECTION SERVICE
// ============================================

let mediaStreamRef: MediaStream | null = null;
let analyserRef: AnalyserNode | null = null;
let audioContextRef: AudioContext | null = null;
let detectionCallbackRef: ((result: MoodDetectionResult) => void) | null = null;
let animationFrameRef: number | null = null;

export const moodDetectionService = {

  /**
   * Démarrer la détection de mood à partir du microphone
   */
  async startMoodDetection(
    onMoodDetected: (result: MoodDetectionResult) => void,
    source: MoodDetectionSource = 'audio'
  ): Promise<void> {
    try {
      // Demander l'accès au microphone
      mediaStreamRef = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        }
      });

      // Créer le contexte audio
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef = new AudioContextClass();

      // Créer l'analyseur
      analyserRef = audioContextRef.createAnalyser();
      analyserRef.fftSize = 2048;
      analyserRef.smoothingTimeConstant = 0.8;

      // Connecter le microphone
      const source = audioContextRef.createMediaStreamSource(mediaStreamRef);
      source.connect(analyserRef);

      detectionCallbackRef = onMoodDetected;

      // Démarrer la détection
      moodDetectionService.detectMoodFrame(source);

      logger.info('Mood detection started', { source }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to start mood detection', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Arrêter la détection de mood
   */
  stopMoodDetection(): void {
    try {
      if (animationFrameRef) {
        cancelAnimationFrame(animationFrameRef);
        animationFrameRef = null;
      }

      if (mediaStreamRef) {
        mediaStreamRef.getTracks().forEach(track => track.stop());
        mediaStreamRef = null;
      }

      if (audioContextRef) {
        audioContextRef.close();
        audioContextRef = null;
      }

      analyserRef = null;
      detectionCallbackRef = null;

      logger.info('Mood detection stopped', undefined, 'MUSIC');
    } catch (error) {
      logger.error('Failed to stop mood detection', error as Error, 'MUSIC');
    }
  },

  /**
   * Détecter le mood à chaque frame audio
   */
  detectMoodFrame(source: MediaStreamAudioSourceNode): void {
    if (!analyserRef || !detectionCallbackRef) return;

    // Analyser l'audio
    const features = moodDetectionService.analyzeAudio();

    // Mapper les features aux moods
    const result = moodDetectionService.mapFeaturesToMood(features);

    // Appeler le callback
    detectionCallbackRef(result);

    // Planifier la prochaine détection
    animationFrameRef = requestAnimationFrame(() => moodDetectionService.detectMoodFrame(source));
  },

  /**
   * Analyser les features audio
   */
  analyzeAudio(): AudioAnalysisFeatures {
    if (!analyserRef) {
      throw new Error('Analyser not initialized');
    }

    const bufferLength = analyserRef.frequencyBinCount;

    // Données de fréquence
    const frequencyData = new Uint8Array(bufferLength);
    analyserRef.getByteFrequencyData(frequencyData);

    // Données temporelles
    const timeDomainData = new Uint8Array(bufferLength);
    analyserRef.getByteTimeDomainData(timeDomainData);

    // Convertir en Float32Array
    const floatTimeDomain = new Float32Array(bufferLength);
    for (let i = 0; i < bufferLength; i++) {
      floatTimeDomain[i] = (timeDomainData[i] - 128) / 128;
    }

    // Calculer les features
    const energy = moodDetectionService.calculateEnergy(floatTimeDomain);
    const spectralCentroid = moodDetectionService.calculateSpectralCentroid(frequencyData);
    const zeroCrossingRate = moodDetectionService.calculateZeroCrossingRate(floatTimeDomain);

    // Calculer les features perceptuelles PAD (Pleasure-Arousal-Dominance)
    const valence = moodDetectionService.getValenceFromEnergy(energy, spectralCentroid);
    const arousal = moodDetectionService.getArousalFromEnergy(energy);
    const dominance = moodDetectionService.getDominanceFromSpectral(spectralCentroid, zeroCrossingRate);

    // Calculer MFCCs (Mel-Frequency Cepstral Coefficients) simplifiés
    const mfcc = moodDetectionService.calculateSimpleMFCC(frequencyData);

    return {
      energy,
      valence,
      arousal,
      dominance,
      spectralCentroid,
      zeroCrossingRate,
      mfcc
    };
  },

  /**
   * Calculer l'énergie du signal
   */
  calculateEnergy(timeDomain: Float32Array): number {
    let energy = 0;
    for (let i = 0; i < timeDomain.length; i++) {
      energy += timeDomain[i] * timeDomain[i];
    }
    return Math.sqrt(energy / timeDomain.length);
  },

  /**
   * Calculer le centroïde spectral
   */
  calculateSpectralCentroid(frequencyData: Uint8Array): number {
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      numerator += i * frequencyData[i];
      denominator += frequencyData[i];
    }

    return denominator > 0 ? numerator / denominator : 0;
  },

  /**
   * Calculer le taux de passage par zéro
   */
  calculateZeroCrossingRate(timeDomain: Float32Array): number {
    let crossings = 0;

    for (let i = 1; i < timeDomain.length; i++) {
      if (
        (timeDomain[i - 1] >= 0 && timeDomain[i] < 0) ||
        (timeDomain[i - 1] < 0 && timeDomain[i] >= 0)
      ) {
        crossings++;
      }
    }

    return crossings / timeDomain.length;
  },

  /**
   * Valence (positif/négatif) basée sur l'énergie et le centroïde spectral
   */
  getValenceFromEnergy(energy: number, spectralCentroid: number): number {
    // Valence plus élevée avec énergie plus élevée et fréquences plus élevées
    const energyComponent = Math.min(energy * 2, 1);
    const spectralComponent = Math.min(spectralCentroid / 1024, 1);

    return (energyComponent * 0.6 + spectralComponent * 0.4);
  },

  /**
   * Arousal (activation) basée sur l'énergie
   */
  getArousalFromEnergy(energy: number): number {
    // Arousal directement corrélé à l'énergie
    return Math.min(energy * 1.5, 1);
  },

  /**
   * Dominance basée sur les caractéristiques spectrales
   */
  getDominanceFromSpectral(spectralCentroid: number, zeroCrossingRate: number): number {
    // Dominance plus élevée avec centroïde spectral plus élevé
    return Math.min((spectralCentroid / 1024 * 0.7 + zeroCrossingRate * 0.3), 1);
  },

  /**
   * Calculer MFCCs simplifiés
   */
  calculateSimpleMFCC(frequencyData: Uint8Array): number[] {
    const mfcc: number[] = [];
    const bands = 13; // Nombre de coefficients MFCC

    // Diviser le spectre en bandes logarithmiques
    for (let i = 0; i < bands; i++) {
      const startIdx = Math.floor((i / bands) * frequencyData.length);
      const endIdx = Math.floor(((i + 1) / bands) * frequencyData.length);

      let sum = 0;
      for (let j = startIdx; j < endIdx; j++) {
        sum += frequencyData[j];
      }

      const average = sum / (endIdx - startIdx);
      mfcc.push(Math.log(average + 1));
    }

    return mfcc;
  },

  /**
   * Mapper les features audio aux moods
   */
  mapFeaturesToMood(features: AudioAnalysisFeatures): MoodDetectionResult {
    const scores: Record<Mood, number> = {
      happy: moodDetectionService.calculateMoodScore('happy', features),
      sad: moodDetectionService.calculateMoodScore('sad', features),
      energetic: moodDetectionService.calculateMoodScore('energetic', features),
      calm: moodDetectionService.calculateMoodScore('calm', features),
      focused: moodDetectionService.calculateMoodScore('focused', features),
      relaxed: moodDetectionService.calculateMoodScore('relaxed', features)
    };

    // Trouver le mood avec le meilleur score
    const moodEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    const topMood = moodEntries[0][0] as Mood;
    const confidence = Math.min(moodEntries[0][1], 1);

    const alternatives = moodEntries.slice(1, 3).map(([mood, score]) => ({
      mood: mood as Mood,
      confidence: Math.min(score, 1)
    }));

    return {
      mood: topMood,
      confidence,
      alternatives,
      source: 'audio',
      timestamp: Date.now(),
      details: {
        energy: features.energy,
        valence: features.valence,
        arousal: features.arousal,
        dominance: features.dominance
      }
    };
  },

  /**
   * Calculer le score d'un mood spécifique
   */
  calculateMoodScore(mood: Mood, features: AudioAnalysisFeatures): number {
    const { energy, valence, arousal } = features;

    switch (mood) {
      case 'happy':
        // Valence élevée, énergie modérée à élevée
        return valence * 0.7 + Math.max(energy - 0.3, 0) * 0.3;

      case 'sad':
        // Valence basse, énergie basse
        return (1 - valence) * 0.7 + (1 - energy) * 0.3;

      case 'energetic':
        // Énergie très élevée, arousal élevé
        return energy * 0.8 + arousal * 0.2;

      case 'calm':
        // Énergie basse, valence modérée à haute
        return (1 - energy) * 0.6 + valence * 0.4;

      case 'focused':
        // Énergie modérée, arousal élevé, valence neutre
        return Math.abs(energy - 0.5) < 0.3 ? 0.7 : 0.3 + arousal * 0.4;

      case 'relaxed':
        // Énergie basse, arousal bas, valence haute
        return (1 - arousal) * 0.6 + valence * 0.4;

      default:
        return 0;
    }
  },

  /**
   * Obtenir les recommandations musicales basées sur le mood détecté
   */
  async getRecommendationsByMood(result: MoodDetectionResult, limit: number = 10): Promise<any[]> {
    try {
      // Importer le service de recommandations
      const { recommendationService } = await import('./recommendations-service');

      const moodMap: Record<Mood, string> = {
        happy: 'happy',
        sad: 'sad',
        energetic: 'energetic',
        calm: 'calm',
        focused: 'focus',
        relaxed: 'relaxing'
      };

      return await recommendationService.getRecommendationsByMood(
        moodMap[result.mood],
        limit
      );
    } catch (error) {
      logger.error('Failed to get recommendations by mood', error as Error, 'MUSIC');
      return [];
    }
  }
};
