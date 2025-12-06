/**
 * Hume AI WebSocket Service
 * Real-time emotion streaming using Hume AI Expression Measurement API
 * Documentation: https://dev.hume.ai/docs/expression-measurement-api
 */

import { logger } from '@/lib/logger';

export interface HumeAIConfig {
  apiKey: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export interface EmotionPrediction {
  name: string; // e.g., 'Joy', 'Sadness', 'Anger', etc.
  score: number; // 0-1 confidence score
}

export interface HumeEmotionResult {
  timestamp: number;
  emotions: EmotionPrediction[];
  topEmotion: EmotionPrediction;
  prosody?: {
    pitch: number;
    tempo: number;
    volume: number;
  };
  face?: {
    box: { x: number; y: number; width: number; height: number };
    landmarks?: Array<{ x: number; y: number }>;
  };
}

export type HumeAIEventType =
  | 'connected'
  | 'disconnected'
  | 'emotion_update'
  | 'error'
  | 'reconnecting';

export interface HumeAIEvent {
  type: HumeAIEventType;
  data?: any;
  error?: Error;
}

export class HumeAIWebSocketService {
  private ws: WebSocket | null = null;
  private config: HumeAIConfig;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private isConnecting: boolean = false;
  private listeners: Map<HumeAIEventType, Set<(event: HumeAIEvent) => void>> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  private readonly HUME_WS_URL = 'wss://api.hume.ai/v0/stream/models';
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds

  constructor(config: HumeAIConfig) {
    this.config = config;
    this.maxReconnectAttempts = config.reconnectAttempts ?? 5;
    this.reconnectDelay = config.reconnectDelay ?? 3000;
  }

  /**
   * Connect to Hume AI WebSocket
   */
  async connect(modelType: 'face' | 'prosody' | 'language' = 'face'): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      logger.info('Already connected to Hume AI', undefined, 'HUME_AI');
      return;
    }

    if (this.isConnecting) {
      logger.info('Connection already in progress', undefined, 'HUME_AI');
      return;
    }

    this.isConnecting = true;

    try {
      // Construct WebSocket URL with API key and model type
      const wsUrl = `${this.HUME_WS_URL}?apikey=${this.config.apiKey}&model=${modelType}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);

      logger.info('Connecting to Hume AI WebSocket', { modelType }, 'HUME_AI');
    } catch (error) {
      this.isConnecting = false;
      logger.error('Failed to create WebSocket connection', error, 'HUME_AI');
      this.emit('error', { error: error as Error });
      throw error;
    }
  }

  /**
   * Disconnect from Hume AI WebSocket
   */
  disconnect(): void {
    this.stopHeartbeat();
    this.clearReconnectTimeout();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = 0;
    this.isConnecting = false;
    logger.info('Disconnected from Hume AI', undefined, 'HUME_AI');
  }

  /**
   * Send audio data for emotion analysis
   */
  sendAudioData(audioBlob: Blob): void {
    if (!this.isConnected()) {
      logger.warn('Cannot send audio: not connected', undefined, 'HUME_AI');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && this.ws) {
        // Convert to base64
        const base64Audio = btoa(
          new Uint8Array(reader.result as ArrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        const message = {
          data: base64Audio,
          models: {
            prosody: {}
          }
        };

        this.ws.send(JSON.stringify(message));
      }
    };
    reader.readAsArrayBuffer(audioBlob);
  }

  /**
   * Send video frame for emotion analysis
   */
  sendVideoFrame(imageData: string): void {
    if (!this.isConnected()) {
      logger.warn('Cannot send video: not connected', undefined, 'HUME_AI');
      return;
    }

    const message = {
      data: imageData, // base64 image
      models: {
        face: {}
      }
    };

    this.ws?.send(JSON.stringify(message));
  }

  /**
   * Send text for emotion analysis
   */
  sendText(text: string): void {
    if (!this.isConnected()) {
      logger.warn('Cannot send text: not connected', undefined, 'HUME_AI');
      return;
    }

    const message = {
      data: text,
      models: {
        language: {}
      }
    };

    this.ws?.send(JSON.stringify(message));
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Add event listener
   */
  on(event: HumeAIEventType, callback: (event: HumeAIEvent) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Remove event listener
   */
  off(event: HumeAIEventType, callback: (event: HumeAIEvent) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    this.listeners.clear();
  }

  /**
   * Handle WebSocket open
   */
  private handleOpen(): void {
    this.isConnecting = false;
    this.reconnectAttempts = 0;

    logger.info('Connected to Hume AI WebSocket', undefined, 'HUME_AI');
    this.emit('connected', {});

    // Start heartbeat
    this.startHeartbeat();
  }

  /**
   * Handle WebSocket message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      // Check for error in response
      if (data.error) {
        logger.error('Hume AI error response', data.error, 'HUME_AI');
        this.emit('error', { error: new Error(data.error.message) });
        return;
      }

      // Parse emotion predictions
      if (data.face || data.prosody || data.language) {
        const result = this.parseEmotionResult(data);
        this.emit('emotion_update', result);
      }
    } catch (error) {
      logger.error('Failed to parse Hume AI message', error, 'HUME_AI');
    }
  }

  /**
   * Handle WebSocket error
   */
  private handleError(event: Event): void {
    logger.error('Hume AI WebSocket error', event, 'HUME_AI');
    this.emit('error', { error: new Error('WebSocket error') });
  }

  /**
   * Handle WebSocket close
   */
  private handleClose(event: CloseEvent): void {
    this.stopHeartbeat();
    this.isConnecting = false;

    logger.info('Hume AI WebSocket closed', {
      code: event.code,
      reason: event.reason,
    }, 'HUME_AI');

    this.emit('disconnected', {
      code: event.code,
      reason: event.reason,
    });

    // Attempt reconnection if not a clean close
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnect();
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    this.reconnectAttempts++;

    logger.info('Attempting to reconnect to Hume AI', {
      attempt: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
    }, 'HUME_AI');

    this.emit('reconnecting', {
      attempt: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
    });

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.ws?.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Clear reconnect timeout
   */
  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  /**
   * Parse emotion result from Hume AI response
   */
  private parseEmotionResult(data: any): HumeEmotionResult {
    const emotions: EmotionPrediction[] = [];

    // Parse face emotions
    if (data.face?.predictions?.[0]?.emotions) {
      emotions.push(...data.face.predictions[0].emotions);
    }

    // Parse prosody emotions
    if (data.prosody?.predictions?.[0]?.emotions) {
      emotions.push(...data.prosody.predictions[0].emotions);
    }

    // Parse language emotions
    if (data.language?.predictions?.[0]?.emotions) {
      emotions.push(...data.language.predictions[0].emotions);
    }

    // Get top emotion
    const topEmotion = emotions.reduce(
      (top, current) => (current.score > top.score ? current : top),
      emotions[0] || { name: 'Neutral', score: 0 }
    );

    const result: HumeEmotionResult = {
      timestamp: Date.now(),
      emotions,
      topEmotion,
    };

    // Add prosody data if available
    if (data.prosody?.predictions?.[0]) {
      const prosody = data.prosody.predictions[0];
      result.prosody = {
        pitch: prosody.pitch || 0,
        tempo: prosody.tempo || 0,
        volume: prosody.volume || 0,
      };
    }

    // Add face data if available
    if (data.face?.predictions?.[0]) {
      const face = data.face.predictions[0];
      result.face = {
        box: face.box,
        landmarks: face.landmarks,
      };
    }

    return result;
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: HumeAIEventType, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback({ type: event, data });
        } catch (error) {
          logger.error('Error in Hume AI event listener', error, 'HUME_AI');
        }
      });
    }
  }
}
