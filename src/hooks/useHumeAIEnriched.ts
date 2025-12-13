/**
 * useHumeAIEnriched - Hook enrichi pour Hume AI avec persistance cross-session
 * Ajoute le stockage d'historique émotionnel et les insights personnalisés
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

export interface EmotionHistoryEntry {
  id: string;
  timestamp: string;
  emotions: HumeEmotionResult;
  context?: string;
  source: 'face' | 'prosody' | 'language';
  session_id: string;
}

export interface EmotionInsight {
  type: 'trend' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  emotion: string;
  score: number;
  created_at: string;
}

export interface UseHumeAIEnrichedOptions {
  apiKey: string;
  modelType?: 'face' | 'prosody' | 'language';
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  persistHistory?: boolean;
  maxHistorySize?: number;
  onEmotionUpdate?: (result: HumeEmotionResult) => void;
  onError?: (error: Error) => void;
}

const STORAGE_KEY = 'hume_emotion_history';
const SESSION_KEY = 'hume_session_id';

export function useHumeAIEnriched(options: UseHumeAIEnrichedOptions) {
  const {
    apiKey,
    modelType = 'face',
    autoConnect = false,
    reconnectAttempts = 5,
    reconnectDelay = 3000,
    persistHistory = true,
    maxHistorySize = 100,
    onEmotionUpdate,
    onError,
  } = options;

  const { user } = useAuth();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<HumeEmotionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryEntry[]>([]);
  const [insights, setInsights] = useState<EmotionInsight[]>([]);
  const [sessionId, setSessionId] = useState<string>(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) return saved;
    const newId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, newId);
    return newId;
  });

  const serviceRef = useRef<HumeAIWebSocketService | null>(null);

  // Charger l'historique persisté
  useEffect(() => {
    if (!persistHistory) return;

    const loadHistory = async () => {
      // D'abord charger depuis localStorage
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as EmotionHistoryEntry[];
          setEmotionHistory(parsed.slice(0, maxHistorySize));
        } catch {
          // Ignorer les erreurs de parsing
        }
      }

      // Puis synchroniser avec Supabase si connecté
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('emotion_history')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false })
            .limit(maxHistorySize);

          if (!error && data) {
            const entries = data.map((d: any) => ({
              id: d.id,
              timestamp: d.timestamp,
              emotions: d.emotions_data,
              context: d.context,
              source: d.source,
              session_id: d.session_id,
            })) as EmotionHistoryEntry[];
            
            setEmotionHistory(entries);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
          }
        } catch (err) {
          logger.warn('Failed to load emotion history from Supabase', err, 'HUME_AI');
        }
      }
    };

    loadHistory();
  }, [user?.id, persistHistory, maxHistorySize]);

  // Générer des insights basés sur l'historique
  useEffect(() => {
    if (emotionHistory.length < 5) return;

    const generateInsights = () => {
      const newInsights: EmotionInsight[] = [];
      
      // Analyser les tendances des dernières 24h
      const last24h = emotionHistory.filter(e => 
        new Date(e.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
      );

      if (last24h.length >= 3) {
        // Calculer les moyennes par émotion
        const emotionAverages: Record<string, number[]> = {};
        
        for (const entry of last24h) {
          for (const emotion of entry.emotions.emotions) {
            if (!emotionAverages[emotion.name]) {
              emotionAverages[emotion.name] = [];
            }
            emotionAverages[emotion.name].push(emotion.score);
          }
        }

        // Trouver l'émotion dominante
        let dominantEmotion = { name: '', avgScore: 0 };
        for (const [name, scores] of Object.entries(emotionAverages)) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          if (avg > dominantEmotion.avgScore) {
            dominantEmotion = { name, avgScore: avg };
          }
        }

        if (dominantEmotion.name) {
          newInsights.push({
            type: 'trend',
            title: `Émotion dominante: ${dominantEmotion.name}`,
            description: `Au cours des dernières 24h, votre émotion dominante a été "${dominantEmotion.name}" avec un score moyen de ${(dominantEmotion.avgScore * 100).toFixed(0)}%.`,
            emotion: dominantEmotion.name,
            score: dominantEmotion.avgScore,
            created_at: new Date().toISOString(),
          });
        }

        // Détecter les patterns négatifs
        const negativeEmotions = ['anger', 'fear', 'sadness', 'disgust', 'contempt'];
        const hasNegativePattern = negativeEmotions.some(emotion => {
          const scores = emotionAverages[emotion] || [];
          return scores.length >= 3 && scores.reduce((a, b) => a + b, 0) / scores.length > 0.5;
        });

        if (hasNegativePattern) {
          newInsights.push({
            type: 'recommendation',
            title: 'Recommandation bien-être',
            description: 'Nous avons détecté un pattern d\'émotions négatives. Une session de respiration ou de méditation pourrait vous aider.',
            emotion: 'mixed',
            score: 0.5,
            created_at: new Date().toISOString(),
          });
        }
      }

      setInsights(newInsights);
    };

    generateInsights();
  }, [emotionHistory]);

  // Sauvegarder une entrée d'émotion
  const saveEmotionEntry = useCallback(async (
    emotions: HumeEmotionResult,
    context?: string
  ) => {
    const entry: EmotionHistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      emotions,
      context,
      source: modelType,
      session_id: sessionId,
    };

    // Mettre à jour l'état local
    setEmotionHistory(prev => {
      const updated = [entry, ...prev].slice(0, maxHistorySize);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    // Persister dans Supabase
    if (user?.id && persistHistory) {
      try {
        await supabase.from('emotion_history').insert({
          id: entry.id,
          user_id: user.id,
          timestamp: entry.timestamp,
          emotions_data: emotions,
          context: entry.context,
          source: entry.source,
          session_id: entry.session_id,
        });
      } catch (err) {
        logger.warn('Failed to save emotion entry to Supabase', err, 'HUME_AI');
      }
    }

    return entry;
  }, [user?.id, persistHistory, modelType, sessionId, maxHistorySize]);

  // Gestionnaires d'événements
  const handleConnected = useCallback(() => {
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
    async (event: HumeAIEvent) => {
      const result = event.data as HumeEmotionResult;
      setCurrentEmotion(result);

      // Sauvegarder l'entrée
      await saveEmotionEntry(result);

      // Callback utilisateur
      if (onEmotionUpdate) {
        onEmotionUpdate(result);
      }
    },
    [onEmotionUpdate, saveEmotionEntry]
  );

  const handleError = useCallback(
    (event: HumeAIEvent) => {
      const error = event.error || new Error('Unknown Hume AI error');
      logger.error('Hume AI error', error, 'HUME_AI');
      setConnectionError(error);
      setIsConnecting(false);
      if (onError) onError(error);
    },
    [onError]
  );

  // Initialiser le service
  useEffect(() => {
    const config: HumeAIConfig = {
      apiKey,
      reconnectAttempts,
      reconnectDelay,
    };

    serviceRef.current = new HumeAIWebSocketService(config);

    const service = serviceRef.current;
    service.on('connected', handleConnected);
    service.on('disconnected', handleDisconnected);
    service.on('emotion_update', handleEmotionUpdate);
    service.on('error', handleError);

    if (autoConnect && apiKey) {
      connect();
    }

    return () => {
      if (serviceRef.current) {
        serviceRef.current.removeAllListeners();
        serviceRef.current.disconnect();
      }
    };
  }, [apiKey, reconnectAttempts, reconnectDelay, autoConnect]);

  const connect = useCallback(async () => {
    if (!serviceRef.current || isConnected || isConnecting) return;

    try {
      setIsConnecting(true);
      setConnectionError(null);
      await serviceRef.current.connect(modelType);
    } catch (error) {
      setConnectionError(error as Error);
      setIsConnecting(false);
    }
  }, [isConnected, isConnecting, modelType]);

  const disconnect = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.disconnect();
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, []);

  const sendAudioData = useCallback((audioBlob: Blob) => {
    if (serviceRef.current && isConnected) {
      serviceRef.current.sendAudioData(audioBlob);
    }
  }, [isConnected]);

  const sendVideoFrame = useCallback((imageData: string) => {
    if (serviceRef.current && isConnected) {
      serviceRef.current.sendVideoFrame(imageData);
    }
  }, [isConnected]);

  const sendText = useCallback((text: string) => {
    if (serviceRef.current && isConnected) {
      serviceRef.current.sendText(text);
    }
  }, [isConnected]);

  const clearHistory = useCallback(() => {
    setEmotionHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const startNewSession = useCallback(() => {
    const newId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, newId);
    setSessionId(newId);
    return newId;
  }, []);

  // Statistiques d'émotions
  const emotionStats = useCallback(() => {
    if (emotionHistory.length === 0) return null;

    const stats: Record<string, { total: number; count: number; avg: number }> = {};
    
    for (const entry of emotionHistory) {
      for (const emotion of entry.emotions.emotions) {
        if (!stats[emotion.name]) {
          stats[emotion.name] = { total: 0, count: 0, avg: 0 };
        }
        stats[emotion.name].total += emotion.score;
        stats[emotion.name].count += 1;
      }
    }

    for (const key of Object.keys(stats)) {
      stats[key].avg = stats[key].total / stats[key].count;
    }

    return stats;
  }, [emotionHistory]);

  return {
    // État connexion
    isConnected,
    isConnecting,
    connectionError,
    
    // Données émotionnelles
    currentEmotion,
    emotionHistory,
    insights,
    sessionId,
    
    // Actions
    connect,
    disconnect,
    sendAudioData,
    sendVideoFrame,
    sendText,
    clearHistory,
    startNewSession,
    saveEmotionEntry,
    
    // Stats
    emotionStats: emotionStats(),
    
    // Service
    service: serviceRef.current,
  };
}

export default useHumeAIEnriched;
