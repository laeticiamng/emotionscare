/**
 * Hume Emotion Detector pour EmotionsCare
 * Corrigé: Utilise Edge Function hume-websocket-proxy au lieu de WebSocket direct
 */

import type { HumeEmotionDetection } from '@/types/music/parcours';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Exponential Moving Average for emotion smoothing
class EMAFilter {
  private alpha: number;
  private value: number | null = null;

  constructor(alpha = 0.3) {
    this.alpha = alpha;
  }

  update(newValue: number): number {
    if (this.value === null) {
      this.value = newValue;
    } else {
      this.value = this.alpha * newValue + (1 - this.alpha) * this.value;
    }
    return this.value;
  }

  reset() {
    this.value = null;
  }
}

export class HumeEmotionDetector {
  private isConnected = false;
  private valenceFilter = new EMAFilter(0.3);
  private arousalFilter = new EMAFilter(0.3);
  private onDetectionCallback: ((detection: HumeEmotionDetection) => void) | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;
  private audioBuffer: ArrayBuffer[] = [];

  /**
   * Connexion au service Hume via Edge Function
   * Note: Pas de WebSocket direct - on utilise le polling ou les appels Edge Function
   */
  async connect(onDetection: (detection: HumeEmotionDetection) => void): Promise<boolean> {
    this.onDetectionCallback = onDetection;
    this.isConnected = true;
    
    logger.info('Hume detector connected (Edge Function mode)', undefined, 'Hume');
    
    // Démarrer le traitement des chunks audio en batch
    this.startBatchProcessing();
    
    return true;
  }

  /**
   * Traitement en batch des chunks audio
   */
  private startBatchProcessing() {
    // Traiter les chunks audio toutes les 2 secondes
    this.pollingInterval = setInterval(async () => {
      if (this.audioBuffer.length > 0) {
        await this.processAudioBatch();
      }
    }, 2000);
  }

  /**
   * Traiter un batch de chunks audio
   */
  private async processAudioBatch() {
    if (this.audioBuffer.length === 0) return;

    const chunks = [...this.audioBuffer];
    this.audioBuffer = [];

    try {
      // Combiner les chunks en un seul buffer
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      
      for (const chunk of chunks) {
        combined.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      }

      // Convertir en base64
      const base64 = btoa(String.fromCharCode(...combined));

      // Appeler l'Edge Function
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: {
          audio: base64,
          analysisType: 'stream_audio',
        },
      });

      if (error) throw error;

      // Traiter la réponse
      if (data?.predictions) {
        this.handlePrediction(data.predictions);
      }
    } catch (error) {
      logger.warn('Hume batch processing error', error as Error, 'Hume');
    }
  }

  /**
   * Traiter une prédiction Hume
   */
  private handlePrediction(predictions: any) {
    const emotions = predictions.emotions || [];
    
    // Find dominant emotion
    let maxScore = 0;
    let dominantEmotion = 'neutral';
    
    emotions.forEach((e: any) => {
      if (e.score > maxScore) {
        maxScore = e.score;
        dominantEmotion = e.name;
      }
    });

    // Apply EMA filtering
    const valence = this.valenceFilter.update(predictions.valence || 0);
    const arousal = this.arousalFilter.update(predictions.arousal || 0);

    const detection: HumeEmotionDetection = {
      emotion: this.mapHumeToPreset(dominantEmotion, valence, arousal),
      confidence: maxScore,
      valence,
      arousal,
    };

    this.onDetectionCallback?.(detection);
  }

  /**
   * Mapper les émotions Hume vers nos presets
   */
  private mapHumeToPreset(humeEmotion: string, valence: number, arousal: number): string {
    const mapping: Record<string, string> = {
      'Anxiety': 'panique-anxiete',
      'Fear': 'peur-anticipatoire',
      'Anger': 'colere-irritabilite',
      'Sadness': 'tristesse-deuil',
      'Joy': 'amour-gratitude',
      'Excitement': 'motivation-energie',
      'Contentment': 'universel-reset',
      'Boredom': 'apathie-demotivation',
      'Concentration': 'concentration-flow',
      'Confusion': 'rumination-culpabilite',
      'Disgust': 'jalousie-envie',
      'Distress': 'stress-overwhelm',
      'Embarrassment': 'honte-anxiete-sociale',
      'Tiredness': 'fatigue-mentale',
      'Nostalgia': 'nostalgie-melancolie',
    };

    return mapping[humeEmotion] || 'universel-reset';
  }

  /**
   * Envoyer un chunk audio pour analyse
   */
  sendAudioChunk(audioData: ArrayBuffer) {
    if (!this.isConnected) return;

    // Rejeter les chunks trop grands (> 5s à 44100Hz mono 16bit)
    if (audioData.byteLength > 44100 * 2 * 5) {
      logger.warn('Audio chunk too large, skipping', { size: audioData.byteLength }, 'Hume');
      return;
    }
    
    // Ajouter au buffer pour traitement en batch
    this.audioBuffer.push(audioData);
  }

  /**
   * Analyser du texte pour les émotions
   */
  async analyzeText(text: string): Promise<HumeEmotionDetection | null> {
    try {
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: {
          text,
          analysisType: 'text_emotion',
        },
      });

      if (error) throw error;

      const emotions = data?.emotions || [];
      let maxScore = 0;
      let dominantEmotion = 'neutral';
      
      emotions.forEach((e: any) => {
        if (e.score > maxScore) {
          maxScore = e.score;
          dominantEmotion = e.name;
        }
      });

      return {
        emotion: this.mapHumeToPreset(dominantEmotion, data?.valence || 0, data?.arousal || 0.5),
        confidence: maxScore,
        valence: data?.valence || 0,
        arousal: data?.arousal || 0.5,
      };
    } catch (error) {
      logger.warn('Hume text analysis failed', error as Error, 'Hume');
      return null;
    }
  }

  /**
   * Analyser une image (visage) pour les émotions
   */
  async analyzeImage(imageBlob: Blob): Promise<HumeEmotionDetection | null> {
    try {
      const buffer = await imageBlob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: {
          image: base64,
          analysisType: 'face_emotion',
        },
      });

      if (error) throw error;

      const emotions = data?.emotions || [];
      let maxScore = 0;
      let dominantEmotion = 'neutral';
      
      emotions.forEach((e: any) => {
        if (e.score > maxScore) {
          maxScore = e.score;
          dominantEmotion = e.name;
        }
      });

      return {
        emotion: this.mapHumeToPreset(dominantEmotion, data?.valence || 0, data?.arousal || 0.5),
        confidence: maxScore,
        valence: data?.valence || 0,
        arousal: data?.arousal || 0.5,
      };
    } catch (error) {
      logger.warn('Hume image analysis failed', error as Error, 'Hume');
      return null;
    }
  }

  /**
   * Déconnecter
   */
  disconnect() {
    this.isConnected = false;
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    this.audioBuffer = [];
    this.valenceFilter.reset();
    this.arousalFilter.reset();
    
    logger.info('Hume detector disconnected', undefined, 'Hume');
  }

  /**
   * Vérifier si connecté
   */
  get connected(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
let humeDetector: HumeEmotionDetector | null = null;

export function getHumeDetector(): HumeEmotionDetector {
  if (!humeDetector) {
    humeDetector = new HumeEmotionDetector();
  }
  return humeDetector;
}

export default HumeEmotionDetector;
