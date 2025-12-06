/**
 * Client WebSocket Hume AI pour analyse émotionnelle temps réel
 *
 * Limitations Hume :
 * - Timeout : 1 minute d'inactivité → reconnect
 * - Audio/vidéo : ≤ 5 secondes par chunk
 * - Texte : ≤ 10 000 caractères
 */
import { logger } from '@/lib/logger';

interface HumeConfig {
  apiKey: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface EmotionData {
  valence: number;
  arousal: number;
  dominantEmotion: string;
  confidence: number;
  timestamp: number;
}

export class HumeStreamClient {
  private ws: WebSocket | null = null;
  private config: HumeConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private smoothedValence = 0.5;
  private smoothedArousal = 0.5;
  private alpha = 0.2; // Facteur EMA (Exponential Moving Average)
  private onEmotionCallback?: (emotion: EmotionData) => void;

  constructor(config: HumeConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      ...config
    };
  }

  connect(onEmotion: (emotion: EmotionData) => void) {
    this.onEmotionCallback = onEmotion;
    this.initWebSocket();
  }

  private initWebSocket() {
    try {
      logger.info('Connecting to Hume WebSocket', null, 'HumeStreamClient.initWebSocket');

      // Hume AI WebSocket endpoint v0
      const wsUrl = `wss://api.hume.ai/v0/stream/models?apiKey=${this.config.apiKey}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        logger.info('Hume WebSocket connected', null, 'HumeStreamClient.onopen');
        this.reconnectAttempts = 0;

        // Configurer les modèles pour analyse émotionnelle
        this.ws?.send(JSON.stringify({
          models: {
            face: {},
            prosody: {},
            language: {}
          }
        }));
      };

      this.ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);

          if (response.face?.predictions || response.prosody?.predictions || response.language?.predictions) {
            const emotionData = this.parseHumeResponse(response);
            this.onEmotionCallback?.(emotionData);
          }
        } catch (error) {
          logger.error('Error parsing Hume response', error, 'HumeStreamClient.onmessage');
        }
      };

      this.ws.onerror = (error) => {
        logger.error('Hume WebSocket error', error, 'HumeStreamClient.onerror');
      };

      this.ws.onclose = () => {
        logger.info('Hume WebSocket closed', null, 'HumeStreamClient.onclose');
        this.handleReconnect();
      };

    } catch (error) {
      logger.error('Hume WebSocket error', error, 'HumeStreamClient.initWebSocket');
      this.handleReconnect();
    }
  }

  private simulateEmotionStream() {
    // Simulation pour développement
    const interval = setInterval(() => {
      const rawValence = Math.random();
      const rawArousal = Math.random();
      
      // Appliquer EMA pour lisser
      this.smoothedValence = this.ema(this.smoothedValence, rawValence);
      this.smoothedArousal = this.ema(this.smoothedArousal, rawArousal);

      const emotionData: EmotionData = {
        valence: this.smoothedValence,
        arousal: this.smoothedArousal,
        dominantEmotion: this.inferEmotion(this.smoothedValence, this.smoothedArousal),
        confidence: 0.7 + Math.random() * 0.3,
        timestamp: Date.now()
      };

      this.onEmotionCallback?.(emotionData);
    }, 2000);

    // Cleanup après 60 secondes (timeout Hume)
    setTimeout(() => {
      clearInterval(interval);
      this.handleReconnect();
    }, 60000);
  }

  private parseHumeResponse(response: any): EmotionData {
    // Extraer emociones de las predicciones de Hume
    let emotions: any[] = [];

    // Combinar predicciones de todos los modelos
    if (response.face?.predictions?.[0]?.emotions) {
      emotions = response.face.predictions[0].emotions;
    } else if (response.prosody?.predictions?.[0]?.emotions) {
      emotions = response.prosody.predictions[0].emotions;
    } else if (response.language?.predictions?.[0]?.emotions) {
      emotions = response.language.predictions[0].emotions;
    }

    // Si no hay emociones, retornar neutral
    if (emotions.length === 0) {
      return {
        valence: 0.5,
        arousal: 0.5,
        dominantEmotion: 'neutral',
        confidence: 0,
        timestamp: Date.now()
      };
    }

    // Encontrar emoción dominante (la de mayor score)
    const dominant = emotions.reduce((max, em) =>
      em.score > max.score ? em : max
    , emotions[0]);

    // Calcular valence y arousal basado en las emociones de Hume
    const { valence, arousal } = this.calculateValenceArousal(emotions);

    // Aplicar suavizado EMA
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
    // Mapeo de emociones de Hume a valence/arousal
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

    // Calcular valence/arousal ponderado por scores
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

  private inferEmotion(valence: number, arousal: number): string {
    if (valence > 0.6 && arousal < 0.4) return 'calm';
    if (valence > 0.6 && arousal > 0.6) return 'excited';
    if (valence < 0.4 && arousal < 0.4) return 'sad';
    if (valence < 0.4 && arousal > 0.6) return 'anxious';
    return 'neutral';
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 5)) {
      logger.error('Max reconnect attempts reached', null, 'HumeStreamClient.handleReconnect');
      return;
    }

    this.reconnectAttempts++;
    logger.info(`Reconnecting to Hume - Attempt ${this.reconnectAttempts}`, null, 'HumeStreamClient.handleReconnect');

    this.reconnectTimer = setTimeout(() => {
      this.initWebSocket();
    }, this.config.reconnectInterval);
  }

  sendAudioChunk(audioData: ArrayBuffer) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      logger.warn('WebSocket not ready', null, 'HumeStreamClient.sendAudioChunk');
      return;
    }

    // Vérifier que le chunk est ≤ 5 secondes
    // Calcul approximatif : 24kHz * 2 bytes * 5s = 240KB
    const maxChunkSize = 240 * 1024;
    if (audioData.byteLength > maxChunkSize) {
      logger.warn('Audio chunk too large, splitting required', null, 'HumeStreamClient.sendAudioChunk');
      // Split le chunk en morceaux plus petits
      const chunks = this.splitAudioChunk(audioData, maxChunkSize);
      chunks.forEach(chunk => this.sendSingleAudioChunk(chunk));
      return;
    }

    this.sendSingleAudioChunk(audioData);
  }

  private sendSingleAudioChunk(audioData: ArrayBuffer) {
    // Encoder en base64 pour Hume API
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioData))
    );

    // Format Hume API pour streaming audio
    this.ws?.send(JSON.stringify({
      data: base64Audio,
      models: {
        prosody: {}
      }
    }));
  }

  private splitAudioChunk(audioData: ArrayBuffer, maxSize: number): ArrayBuffer[] {
    const chunks: ArrayBuffer[] = [];
    const view = new Uint8Array(audioData);

    for (let i = 0; i < view.length; i += maxSize) {
      chunks.push(view.slice(i, i + maxSize).buffer);
    }

    return chunks;
  }

  sendText(text: string) {
    if (text.length > 10000) {
      logger.warn('Text too long, truncating to 10000 chars', null, 'HumeStreamClient.sendText');
      text = text.substring(0, 10000);
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      logger.warn('WebSocket not ready', null, 'HumeStreamClient.sendText');
      return;
    }

    // Format Hume API pour analyse de texte
    this.ws.send(JSON.stringify({
      data: text,
      models: {
        language: {}
      }
    }));
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  getSmoothedEmotion(): { valence: number; arousal: number } {
    return {
      valence: this.smoothedValence,
      arousal: this.smoothedArousal
    };
  }
}
