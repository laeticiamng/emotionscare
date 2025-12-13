/**
 * useHumeAI - Hook enrichi pour Hume AI avec reconnexion automatique
 * et persistance cross-session
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  HumeAIWebSocketService,
  type HumeAIConfig,
  type HumeEmotionResult,
  type HumeAIEvent,
} from '@/services/ai/HumeAIWebSocketService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface UseHumeAIOptions {
  apiKey: string;
  modelType?: 'face' | 'prosody' | 'language';
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  persistHistory?: boolean;
  onEmotionUpdate?: (result: HumeEmotionResult) => void;
  onError?: (error: Error) => void;
}

export interface UseHumeAIReturn {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: Error | null;
  currentEmotion: HumeEmotionResult | null;
  emotionHistory: HumeEmotionResult[];
  sessionStats: SessionStats;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendAudioData: (audioBlob: Blob) => void;
  sendVideoFrame: (imageData: string) => void;
  sendText: (text: string) => void;
  clearHistory: () => void;
  getEmotionInsights: () => EmotionInsights;
  service: HumeAIWebSocketService | null;
}

interface SessionStats {
  totalAnalyses: number;
  sessionDuration: number;
  dominantEmotion: string;
  emotionVariability: number;
  averageConfidence: number;
}

interface EmotionInsights {
  trend: 'improving' | 'stable' | 'declining';
  dominantEmotions: Array<{ name: string; percentage: number }>;
  recommendations: string[];
  emotionalBalance: number;
}

const HISTORY_STORAGE_KEY = 'hume_emotion_history';
const MAX_HISTORY_SIZE = 100;

export function useHumeAI(options: UseHumeAIOptions): UseHumeAIReturn {
  const {
    apiKey,
    modelType = 'face',
    autoConnect = false,
    reconnectAttempts = 5,
    reconnectDelay = 3000,
    persistHistory = true,
    onEmotionUpdate,
    onError,
  } = options;

  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<HumeEmotionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<HumeEmotionResult[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalAnalyses: 0,
    sessionDuration: 0,
    dominantEmotion: 'neutral',
    emotionVariability: 0,
    averageConfidence: 0
  });

  const serviceRef = useRef<HumeAIWebSocketService | null>(null);
  const modelTypeRef = useRef(modelType);
  const sessionStartRef = useRef<number>(Date.now());
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Charger l'historique depuis Supabase au démarrage
  useEffect(() => {
    if (!persistHistory || !user) return;

    const loadHistory = async () => {
      try {
        const { data } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', HISTORY_STORAGE_KEY)
          .maybeSingle();

        if (data?.value) {
          const parsed = typeof data.value === 'string' 
            ? JSON.parse(data.value) 
            : data.value;
          if (Array.isArray(parsed)) {
            setEmotionHistory(parsed.slice(0, MAX_HISTORY_SIZE));
          }
        }
      } catch (error) {
        logger.warn('[HumeAI] Failed to load history', error, 'HUME_AI');
      }
    };

    loadHistory();
  }, [user?.id, persistHistory]);

  // Sauvegarder l'historique quand il change
  useEffect(() => {
    if (!persistHistory || !user || emotionHistory.length === 0) return;

    const saveHistory = async () => {
      try {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            key: HISTORY_STORAGE_KEY,
            value: JSON.stringify(emotionHistory.slice(0, MAX_HISTORY_SIZE)),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,key'
          });
      } catch (error) {
        logger.warn('[HumeAI] Failed to save history', error, 'HUME_AI');
      }
    };

    // Debounce
    const timeout = setTimeout(saveHistory, 2000);
    return () => clearTimeout(timeout);
  }, [emotionHistory, user?.id, persistHistory]);

  // Initialiser le service
  useEffect(() => {
    const config: HumeAIConfig = {
      apiKey,
      reconnectAttempts,
      reconnectDelay,
    };

    serviceRef.current = new HumeAIWebSocketService(config);
    sessionStartRef.current = Date.now();

    const service = serviceRef.current;

    service.on('connected', handleConnected);
    service.on('disconnected', handleDisconnected);
    service.on('emotion_update', handleEmotionUpdate);
    service.on('error', handleError);
    service.on('reconnecting', handleReconnecting);

    if (autoConnect) {
      connect();
    }

    // Heartbeat pour détecter les déconnexions silencieuses
    heartbeatRef.current = setInterval(() => {
      if (isConnected && serviceRef.current) {
        // Vérifier l'état de la connexion
        updateSessionStats();
      }
    }, 10000);

    return () => {
      if (serviceRef.current) {
        serviceRef.current.removeAllListeners();
        serviceRef.current.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, [apiKey, reconnectAttempts, reconnectDelay, autoConnect]);

  const handleConnected = useCallback(() => {
    logger.info('[HumeAI] Connected', {}, 'HUME_AI');
    setIsConnected(true);
    setIsConnecting(false);
    setConnectionError(null);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const handleDisconnected = useCallback((event: HumeAIEvent) => {
    logger.info('[HumeAI] Disconnected', event.data, 'HUME_AI');
    setIsConnected(false);
    setIsConnecting(false);

    // Auto-reconnexion après délai
    if (!reconnectTimeoutRef.current) {
      reconnectTimeoutRef.current = setTimeout(() => {
        logger.info('[HumeAI] Auto-reconnecting...', {}, 'HUME_AI');
        connect();
      }, reconnectDelay);
    }
  }, [reconnectDelay]);

  const handleEmotionUpdate = useCallback((event: HumeAIEvent) => {
    const result = event.data as HumeEmotionResult;

    setCurrentEmotion(result);
    setEmotionHistory((prev) => {
      const updated = [result, ...prev].slice(0, MAX_HISTORY_SIZE);
      return updated;
    });

    if (onEmotionUpdate) {
      onEmotionUpdate(result);
    }

    logger.debug('[HumeAI] Emotion update', {
      topEmotion: result.topEmotion.name,
      score: result.topEmotion.score,
    }, 'HUME_AI');
  }, [onEmotionUpdate]);

  const handleError = useCallback((event: HumeAIEvent) => {
    const error = event.error || new Error('Unknown Hume AI error');
    logger.error('[HumeAI] Error', error, 'HUME_AI');

    setConnectionError(error);
    setIsConnecting(false);

    if (onError) {
      onError(error);
    }

    // Retry connection après erreur
    if (!reconnectTimeoutRef.current) {
      reconnectTimeoutRef.current = setTimeout(() => {
        logger.info('[HumeAI] Retrying after error...', {}, 'HUME_AI');
        connect();
      }, reconnectDelay * 2);
    }
  }, [onError, reconnectDelay]);

  const handleReconnecting = useCallback((event: HumeAIEvent) => {
    logger.info('[HumeAI] Reconnecting', event.data, 'HUME_AI');
    setIsConnecting(true);
  }, []);

  const updateSessionStats = useCallback(() => {
    const duration = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    
    const emotionCounts: Record<string, number> = {};
    let totalConfidence = 0;
    
    emotionHistory.forEach((result) => {
      const name = result.topEmotion.name;
      emotionCounts[name] = (emotionCounts[name] || 0) + 1;
      totalConfidence += result.topEmotion.score;
    });

    const dominantEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

    const uniqueEmotions = Object.keys(emotionCounts).length;
    const variability = Math.min(uniqueEmotions / 10, 1);

    setSessionStats({
      totalAnalyses: emotionHistory.length,
      sessionDuration: duration,
      dominantEmotion,
      emotionVariability: variability,
      averageConfidence: emotionHistory.length > 0 
        ? totalConfidence / emotionHistory.length 
        : 0
    });
  }, [emotionHistory]);

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
      logger.error('[HumeAI] Failed to connect', err, 'HUME_AI');
    }
  }, [isConnected, isConnecting]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (serviceRef.current) {
      serviceRef.current.disconnect();
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, []);

  const sendAudioData = useCallback((audioBlob: Blob) => {
    if (!serviceRef.current || !isConnected) {
      logger.warn('[HumeAI] Cannot send audio: not connected', undefined, 'HUME_AI');
      return;
    }
    serviceRef.current.sendAudioData(audioBlob);
  }, [isConnected]);

  const sendVideoFrame = useCallback((imageData: string) => {
    if (!serviceRef.current || !isConnected) {
      logger.warn('[HumeAI] Cannot send video: not connected', undefined, 'HUME_AI');
      return;
    }
    serviceRef.current.sendVideoFrame(imageData);
  }, [isConnected]);

  const sendText = useCallback((text: string) => {
    if (!serviceRef.current || !isConnected) {
      logger.warn('[HumeAI] Cannot send text: not connected', undefined, 'HUME_AI');
      return;
    }
    serviceRef.current.sendText(text);
  }, [isConnected]);

  const clearHistory = useCallback(async () => {
    setEmotionHistory([]);
    setCurrentEmotion(null);
    
    if (user) {
      try {
        await supabase
          .from('user_settings')
          .delete()
          .eq('user_id', user.id)
          .eq('key', HISTORY_STORAGE_KEY);
      } catch (error) {
        logger.warn('[HumeAI] Failed to clear history from Supabase', error, 'HUME_AI');
      }
    }
  }, [user]);

  const getEmotionInsights = useCallback((): EmotionInsights => {
    if (emotionHistory.length < 3) {
      return {
        trend: 'stable',
        dominantEmotions: [],
        recommendations: ['Continue à utiliser l\'analyse pour obtenir des insights'],
        emotionalBalance: 0.5
      };
    }

    // Analyser les tendances
    const recentEmotions = emotionHistory.slice(0, 10);
    const olderEmotions = emotionHistory.slice(10, 20);

    const positiveEmotions = ['joy', 'interest', 'admiration', 'amusement', 'contentment', 'love'];
    
    const recentPositiveRatio = recentEmotions.filter(e => 
      positiveEmotions.includes(e.topEmotion.name.toLowerCase())
    ).length / recentEmotions.length;

    const olderPositiveRatio = olderEmotions.length > 0
      ? olderEmotions.filter(e => positiveEmotions.includes(e.topEmotion.name.toLowerCase())).length / olderEmotions.length
      : 0.5;

    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentPositiveRatio > olderPositiveRatio + 0.1) {
      trend = 'improving';
    } else if (recentPositiveRatio < olderPositiveRatio - 0.1) {
      trend = 'declining';
    }

    // Émotions dominantes
    const emotionCounts: Record<string, number> = {};
    emotionHistory.forEach(e => {
      const name = e.topEmotion.name;
      emotionCounts[name] = (emotionCounts[name] || 0) + 1;
    });

    const total = emotionHistory.length;
    const dominantEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / total) * 100)
      }));

    // Recommandations
    const recommendations: string[] = [];
    if (trend === 'declining') {
      recommendations.push('Prends une pause et essaie un exercice de respiration');
      recommendations.push('Écoute de la musique apaisante');
    } else if (trend === 'improving') {
      recommendations.push('Continue sur cette lancée !');
      recommendations.push('Note ce qui t\'a aidé aujourd\'hui');
    } else {
      recommendations.push('Explore le module de méditation');
      recommendations.push('Partage ton ressenti dans le journal');
    }

    return {
      trend,
      dominantEmotions,
      recommendations,
      emotionalBalance: recentPositiveRatio
    };
  }, [emotionHistory]);

  return {
    isConnected,
    isConnecting,
    connectionError,
    currentEmotion,
    emotionHistory,
    sessionStats,
    connect,
    disconnect,
    sendAudioData,
    sendVideoFrame,
    sendText,
    clearHistory,
    getEmotionInsights,
    service: serviceRef.current,
  };
}
