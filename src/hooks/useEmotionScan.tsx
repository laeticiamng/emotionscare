// @ts-nocheck

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EmotionResult } from '@/types/emotion';
import { emotionService, EmotionAnalysisRequest } from '@/services/emotion';
import { v4 as uuid } from 'uuid';
import { logger } from '@/lib/logger';

export function useEmotionScan() {
  const { user } = useAuth() || { user: null };
  const [isScanning, setIsScanning] = useState(false);
  const [latestEmotion, setLatestEmotion] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Analyse d'émotion complète avec IA
  const scanEmotion = useCallback(async (
    type: 'text' | 'voice' | 'image',
    data: string | File,
    context?: string
  ): Promise<EmotionResult | null> => {
    if (!user?.id) {
      setError('Vous devez être connecté pour analyser vos émotions');
      return null;
    }

    try {
      setIsScanning(true);
      setError(null);

      // Analyse avec le service d'émotion
      const analysisRequest: EmotionAnalysisRequest = {
        type,
        data,
        context
      };

      const analysisResult = await emotionService.analyzeEmotion(analysisRequest);
      
      // Sauvegarde du résultat
      const emotionResult = await emotionService.saveEmotionResult(analysisResult, user.id);
      
      setLatestEmotion(emotionResult);
      return emotionResult;
    } catch (err) {
      logger.error('Error scanning emotion', err as Error, 'SCAN');
      setError('Échec de l\'analyse émotionnelle');
      return null;
    } finally {
      setIsScanning(false);
    }
  }, [user?.id]);

  // Analyse rapide de texte
  const analyzeText = useCallback(async (text: string, context?: string): Promise<EmotionResult | null> => {
    return scanEmotion('text', text, context);
  }, [scanEmotion]);

  // Analyse de fichier audio
  const analyzeVoice = useCallback(async (audioFile: File): Promise<EmotionResult | null> => {
    return scanEmotion('voice', audioFile);
  }, [scanEmotion]);

  // Analyse d'image
  const analyzeImage = useCallback(async (imageFile: File): Promise<EmotionResult | null> => {
    return scanEmotion('image', imageFile);
  }, [scanEmotion]);

  // Récupération de la dernière émotion
  const fetchLatest = useCallback(async (): Promise<EmotionResult | null> => {
    if (!user?.id) return null;
    
    try {
      setIsScanning(true);
      setError(null);
      
      const emotions = await emotionService.getUserEmotions(user.id, 1);
      const latestEmotion = emotions[0] || null;
      
      setLatestEmotion(latestEmotion);
      return latestEmotion;
    } catch (err) {
      logger.error('Error fetching latest emotion', err as Error, 'SCAN');
      setError('Impossible de charger votre dernière analyse');
      return null;
    } finally {
      setIsScanning(false);
    }
  }, [user?.id]);

  // Historique des émotions
  const getEmotionHistory = useCallback(async (limit: number = 20): Promise<EmotionResult[]> => {
    if (!user?.id) return [];
    
    try {
      return await emotionService.getUserEmotions(user.id, limit);
    } catch (err) {
      logger.error('Error fetching emotion history', err as Error, 'SCAN');
      return [];
    }
  }, [user?.id]);

  // Tendances émotionnelles
  const getEmotionTrends = useCallback(async (days: number = 7) => {
    if (!user?.id) return null;
    
    try {
      return await emotionService.getEmotionTrends(user.id, days);
    } catch (err) {
      logger.error('Error fetching emotion trends', err as Error, 'SCAN');
      return null;
    }
  }, [user?.id]);

  // Recommandations basées sur l'émotion
  const getRecommendations = useCallback(async (emotion: string, intensity: number = 0.7) => {
    try {
      return await emotionService.getEmotionRecommendations(emotion, intensity);
    } catch (err) {
      logger.error('Error fetching recommendations', err as Error, 'SCAN');
      return {
        activities: [],
        music_style: 'calm',
        exercises: [],
        tips: []
      };
    }
  }, []);

  // Création manuelle d'une entrée d'émotion
  const createEmotion = useCallback(async (data: Partial<EmotionResult>): Promise<EmotionResult | null> => {
    if (!user?.id) {
      setError('Vous devez être connecté pour sauvegarder des émotions');
      return null;
    }
    
    try {
      setIsScanning(true);
      setError(null);
      
      const emotionData: EmotionResult = {
        ...data,
        id: data.id || uuid(),
        emotion: data.emotion || 'neutral',
        confidence: data.confidence || 1.0,
        timestamp: data.timestamp || new Date().toISOString(),
        user_id: user.id,
        emojis: data.emojis || [],
        emotions: data.emotions || {},
        source: data.source || 'manual'
      };
      
      const analysisResponse = {
        id: emotionData.id,
        emotion: emotionData.emotion,
        confidence: emotionData.confidence,
        emotions: emotionData.emotions,
        emojis: emotionData.emojis,
        source: emotionData.source,
        timestamp: emotionData.timestamp
      };
      
      const newEmotion = await emotionService.saveEmotionResult(analysisResponse, user.id);
      setLatestEmotion(newEmotion);
      
      return newEmotion;
    } catch (err) {
      logger.error('Error creating emotion', err as Error, 'SCAN');
      setError('Impossible de sauvegarder l\'émotion');
      return null;
    } finally {
      setIsScanning(false);
    }
  }, [user?.id]);

  return {
    // États
    latestEmotion,
    isScanning,
    error,
    
    // Actions principales
    scanEmotion,
    analyzeText,
    analyzeVoice,
    analyzeImage,
    
    // Gestion des données
    fetchLatest,
    createEmotion,
    getEmotionHistory,
    getEmotionTrends,
    getRecommendations,
    
    // Utilitaires
    setLatestEmotion
  };
}

export default useEmotionScan;
