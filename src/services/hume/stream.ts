/**
 * Client Hume AI pour analyse émotionnelle
 * Utilise les Edge Functions - pas de clé API côté client
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface EmotionData {
  valence: number;
  arousal: number;
  dominantEmotion: string;
  confidence: number;
  timestamp: number;
}

interface HumeConfig {
  onEmotion?: (emotion: EmotionData) => void;
}

/**
 * Client Hume utilisant les Edge Functions pour l'analyse émotionnelle
 * Sécurisé - pas d'exposition de clé API
 */
export class HumeStreamClient {
  private smoothedValence = 0.5;
  private smoothedArousal = 0.5;
  private alpha = 0.2; // Facteur EMA
  private isConnected = false;
  private onEmotionCallback?: (emotion: EmotionData) => void;

  constructor(_config?: HumeConfig) {
  }

  connect(onEmotion: (emotion: EmotionData) => void) {
    this.onEmotionCallback = onEmotion;
    this.isConnected = true;
    logger.info('Hume client connected (Edge Function mode)', null, 'HumeStreamClient');
  }

  /**
   * Analyse du texte via Edge Function
   */
  async sendText(text: string): Promise<void> {
    if (!this.isConnected || !text.trim()) return;

    try {
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { 
          text, 
          analysisType: 'text' 
        }
      });

      if (error) {
        logger.error('Hume text analysis error', error, 'HumeStreamClient');
        return;
      }

      if (data?.emotions) {
        const emotionData = this.processResponse(data);
        this.onEmotionCallback?.(emotionData);
      }
    } catch (error) {
      logger.error('Hume text analysis failed', error, 'HumeStreamClient');
    }
  }

  /**
   * Analyse audio via Edge Function
   */
  async sendAudioChunk(audioData: ArrayBuffer): Promise<void> {
    if (!this.isConnected) return;

    try {
      // Convertir en base64
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(audioData))
      );

      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { 
          audio: base64Audio, 
          analysisType: 'prosody' 
        }
      });

      if (error) {
        logger.error('Hume audio analysis error', error, 'HumeStreamClient');
        return;
      }

      if (data?.emotions) {
        const emotionData = this.processResponse(data);
        this.onEmotionCallback?.(emotionData);
      }
    } catch (error) {
      logger.error('Hume audio analysis failed', error, 'HumeStreamClient');
    }
  }

  private processResponse(data: any): EmotionData {
    const emotions = data.emotions || [];
    
    if (emotions.length === 0) {
      return {
        valence: 0.5,
        arousal: 0.5,
        dominantEmotion: 'neutral',
        confidence: 0,
        timestamp: Date.now()
      };
    }

    const dominant = emotions.reduce((max: any, em: any) =>
      em.score > max.score ? em : max
    , emotions[0]);

    const { valence, arousal } = this.calculateValenceArousal(emotions);

    // Appliquer suavizado EMA
    this.smoothedValence = this.ema(this.smoothedValence, valence);
    this.smoothedArousal = this.ema(this.smoothedArousal, arousal);

    return {
      valence: this.smoothedValence,
      arousal: this.smoothedArousal,
      dominantEmotion: dominant.name,
      confidence: dominant.score,
      timestamp: Date.now()
    };
  }

  private calculateValenceArousal(emotions: any[]): { valence: number; arousal: number } {
    const emotionMap: Record<string, { valence: number; arousal: number }> = {
      joy: { valence: 0.9, arousal: 0.7 },
      excitement: { valence: 0.9, arousal: 0.9 },
      contentment: { valence: 0.7, arousal: 0.3 },
      calmness: { valence: 0.6, arousal: 0.2 },
      sadness: { valence: 0.2, arousal: 0.3 },
      anger: { valence: 0.2, arousal: 0.9 },
      fear: { valence: 0.1, arousal: 0.8 },
      anxiety: { valence: 0.3, arousal: 0.8 },
      surprise: { valence: 0.5, arousal: 0.8 },
      disgust: { valence: 0.2, arousal: 0.6 },
      neutral: { valence: 0.5, arousal: 0.5 }
    };

    let totalValence = 0;
    let totalArousal = 0;
    let totalWeight = 0;

    emotions.forEach(emotion => {
      const mapped = emotionMap[emotion.name.toLowerCase()] || { valence: 0.5, arousal: 0.5 };
      const weight = emotion.score;

      totalValence += mapped.valence * weight;
      totalArousal += mapped.arousal * weight;
      totalWeight += weight;
    });

    return {
      valence: totalWeight > 0 ? totalValence / totalWeight : 0.5,
      arousal: totalWeight > 0 ? totalArousal / totalWeight : 0.5
    };
  }

  private ema(previous: number, current: number): number {
    return previous + this.alpha * (current - previous);
  }

  disconnect() {
    this.isConnected = false;
    this.onEmotionCallback = undefined;
    logger.info('Hume client disconnected', null, 'HumeStreamClient');
  }

  getSmoothedEmotion(): { valence: number; arousal: number } {
    return {
      valence: this.smoothedValence,
      arousal: this.smoothedArousal
    };
  }
}
