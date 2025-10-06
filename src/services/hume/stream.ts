// @ts-nocheck
/**
 * Client WebSocket Hume AI pour analyse émotionnelle temps réel
 * 
 * Limitations Hume :
 * - Timeout : 1 minute d'inactivité → reconnect
 * - Audio/vidéo : ≤ 5 secondes par chunk
 * - Texte : ≤ 10 000 caractères
 */

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
      // TODO: Remplacer par l'endpoint Hume réel
      // Pour l'instant, simulation
      console.log('🎭 Connecting to Hume WebSocket...');
      
      // Simulation : générer des émotions aléatoires
      this.simulateEmotionStream();
      
    } catch (error) {
      console.error('❌ Hume WebSocket error:', error);
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
      console.error('❌ Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Reconnecting to Hume... Attempt ${this.reconnectAttempts}`);

    this.reconnectTimer = setTimeout(() => {
      this.initWebSocket();
    }, this.config.reconnectInterval);
  }

  sendAudioChunk(audioData: ArrayBuffer) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket not ready');
      return;
    }

    // Vérifier que le chunk est ≤ 5 secondes
    // Calcul approximatif : 24kHz * 2 bytes * 5s = 240KB
    const maxChunkSize = 240 * 1024;
    if (audioData.byteLength > maxChunkSize) {
      console.warn('⚠️ Audio chunk too large, splitting required');
      // TODO: Implémenter le splitting automatique
      return;
    }

    // Encoder en base64 et envoyer
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioData))
    );
    
    this.ws.send(JSON.stringify({
      type: 'audio',
      data: base64Audio
    }));
  }

  sendText(text: string) {
    if (text.length > 10000) {
      console.warn('⚠️ Text too long, truncating to 10000 chars');
      text = text.substring(0, 10000);
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket not ready');
      return;
    }

    this.ws.send(JSON.stringify({
      type: 'text',
      data: text
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
