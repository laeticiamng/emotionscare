/**
 * React Hook for Hume AI WebSocket Integration
 * Provides real-time emotion streaming capabilities
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  HumeAIWebSocketService,
  type HumeAIConfig,
  type HumeEmotionResult,
  type HumeAIEvent,
} from '@/services/ai/HumeAIWebSocketService';
import { logger } from '@/lib/logger';

export interface UseHumeAIOptions {
  apiKey: string;
  modelType?: 'face' | 'prosody' | 'language';
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  onEmotionUpdate?: (result: HumeEmotionResult) => void;
  onError?: (error: Error) => void;
}

export interface UseHumeAIReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: Error | null;

  // Emotion data
  currentEmotion: HumeEmotionResult | null;
  emotionHistory: HumeEmotionResult[];

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  sendAudioData: (audioBlob: Blob) => void;
  sendVideoFrame: (imageData: string) => void;
  sendText: (text: string) => void;
  clearHistory: () => void;

  // Service instance (for advanced usage)
  service: HumeAIWebSocketService | null;
}

/**
 * Hook for integrating Hume AI real-time emotion streaming
 */
export function useHumeAI(options: UseHumeAIOptions): UseHumeAIReturn {
  const {
    apiKey,
    modelType = 'face',
    autoConnect = false,
    reconnectAttempts = 5,
    reconnectDelay = 3000,
    onEmotionUpdate,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<HumeEmotionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<HumeEmotionResult[]>([]);

  const serviceRef = useRef<HumeAIWebSocketService | null>(null);
  const modelTypeRef = useRef(modelType);

  // Initialize service
  useEffect(() => {
    const config: HumeAIConfig = {
      apiKey,
      reconnectAttempts,
      reconnectDelay,
    };

    serviceRef.current = new HumeAIWebSocketService(config);

    // Setup event listeners
    const service = serviceRef.current;

    service.on('connected', handleConnected);
    service.on('disconnected', handleDisconnected);
    service.on('emotion_update', handleEmotionUpdate);
    service.on('error', handleError);
    service.on('reconnecting', handleReconnecting);

    // Auto-connect if enabled
    if (autoConnect) {
      connect();
    }

    // Cleanup
    return () => {
      if (serviceRef.current) {
        serviceRef.current.removeAllListeners();
        serviceRef.current.disconnect();
      }
    };
  }, [apiKey, reconnectAttempts, reconnectDelay, autoConnect]);

  const handleConnected = useCallback((event: HumeAIEvent) => {
    logger.info('Hume AI connected', undefined, 'HUME_AI');
    setIsConnected(true);
    setIsConnecting(false);
    setConnectionError(null);
  }, []);

  const handleDisconnected = useCallback((event: HumeAIEvent) => {
    logger.info('Hume AI disconnected', event.data, 'HUME_AI');
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const handleEmotionUpdate = useCallback(
    (event: HumeAIEvent) => {
      const result = event.data as HumeEmotionResult;

      setCurrentEmotion(result);
      setEmotionHistory((prev) => [result, ...prev].slice(0, 50)); // Keep last 50 results

      // Call user callback
      if (onEmotionUpdate) {
        onEmotionUpdate(result);
      }

      logger.debug('Emotion update received', {
        topEmotion: result.topEmotion.name,
        score: result.topEmotion.score,
      }, 'HUME_AI');
    },
    [onEmotionUpdate]
  );

  const handleError = useCallback(
    (event: HumeAIEvent) => {
      const error = event.error || new Error('Unknown Hume AI error');
      logger.error('Hume AI error', error, 'HUME_AI');

      setConnectionError(error);
      setIsConnecting(false);

      // Call user error handler
      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  const handleReconnecting = useCallback((event: HumeAIEvent) => {
    logger.info('Hume AI reconnecting', event.data, 'HUME_AI');
    setIsConnecting(true);
  }, []);

  const connect = useCallback(async () => {
    if (!serviceRef.current) {
      const error = new Error('Hume AI service not initialized');
      setConnectionError(error);
      return;
    }

    if (isConnected || isConnecting) {
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionError(null);
      await serviceRef.current.connect(modelTypeRef.current);
    } catch (error) {
      const err = error as Error;
      setConnectionError(err);
      setIsConnecting(false);
      logger.error('Failed to connect to Hume AI', err, 'HUME_AI');
    }
  }, [isConnected, isConnecting]);

  const disconnect = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.disconnect();
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, []);

  const sendAudioData = useCallback((audioBlob: Blob) => {
    if (!serviceRef.current || !isConnected) {
      logger.warn('Cannot send audio: not connected', undefined, 'HUME_AI');
      return;
    }
    serviceRef.current.sendAudioData(audioBlob);
  }, [isConnected]);

  const sendVideoFrame = useCallback((imageData: string) => {
    if (!serviceRef.current || !isConnected) {
      logger.warn('Cannot send video: not connected', undefined, 'HUME_AI');
      return;
    }
    serviceRef.current.sendVideoFrame(imageData);
  }, [isConnected]);

  const sendText = useCallback((text: string) => {
    if (!serviceRef.current || !isConnected) {
      logger.warn('Cannot send text: not connected', undefined, 'HUME_AI');
      return;
    }
    serviceRef.current.sendText(text);
  }, [isConnected]);

  const clearHistory = useCallback(() => {
    setEmotionHistory([]);
    setCurrentEmotion(null);
  }, []);

  return {
    isConnected,
    isConnecting,
    connectionError,
    currentEmotion,
    emotionHistory,
    connect,
    disconnect,
    sendAudioData,
    sendVideoFrame,
    sendText,
    clearHistory,
    service: serviceRef.current,
  };
}
