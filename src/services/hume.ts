// @ts-nocheck
import type { HumeEmotionDetection } from '@/types/music/parcours';
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
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private valenceFilter = new EMAFilter(0.3);
  private arousalFilter = new EMAFilter(0.3);
  private onDetectionCallback: ((detection: HumeEmotionDetection) => void) | null = null;

  async connect(apiKey: string, onDetection: (detection: HumeEmotionDetection) => void) {
    this.onDetectionCallback = onDetection;
    
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`wss://api.hume.ai/v0/stream/models`);
        
        this.ws.onopen = () => {
          logger.info('Hume WebSocket connected', undefined, 'Hume');
          this.reconnectAttempts = 0;
          
          // Send auth
          this.ws?.send(JSON.stringify({
            type: 'auth',
            apiKey: apiKey
          }));
          
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            logger.error('Hume message parse error', error, 'Hume');
          }
        };

        this.ws.onerror = (error) => {
          logger.error('Hume WebSocket error', error, 'Hume');
          reject(error);
        };

        this.ws.onclose = () => {
          logger.info('Hume WebSocket closed', undefined, 'Hume');
          this.attemptReconnect(apiKey);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(data: any) {
    if (data.type === 'emotion_prediction') {
      const emotions = data.predictions?.emotions || [];
      
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
      const valence = this.valenceFilter.update(data.predictions?.valence || 0);
      const arousal = this.arousalFilter.update(data.predictions?.arousal || 0);

      const detection: HumeEmotionDetection = {
        emotion: this.mapHumeToPreset(dominantEmotion, valence, arousal),
        confidence: maxScore,
        valence,
        arousal
      };

      this.onDetectionCallback?.(detection);
    }
  }

  private mapHumeToPreset(humeEmotion: string, valence: number, arousal: number): string {
    // Map Hume emotions to our 20 presets
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
      'Nostalgia': 'nostalgie-melancolie'
    };

    return mapping[humeEmotion] || 'universel-reset';
  }

  private attemptReconnect(apiKey: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      
      logger.info(`Attempting Hume reconnect in ${delay}ms`, { attempt: this.reconnectAttempts }, 'Hume');
      
      setTimeout(() => {
        if (this.onDetectionCallback) {
          this.connect(apiKey, this.onDetectionCallback);
        }
      }, delay);
    }
  }

  sendAudioChunk(audioData: ArrayBuffer) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      // Reject chunks > 5s (arbitrary limit for MVP)
      if (audioData.byteLength > 44100 * 2 * 5) {
        logger.warn('Audio chunk too large, skipping', { size: audioData.byteLength }, 'Hume');
        return;
      }
      
      this.ws.send(audioData);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.valenceFilter.reset();
    this.arousalFilter.reset();
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
