/**
 * Hook pour gérer l'overlay émotionnel sur le cerveau 3D
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchPatientEmotions, 
  mapEmotionsToBrainRegions,
  generateRealtimeEmotionStream,
  type EmotionOverlayData,
  type HumeEmotionScore
} from '@/services/dicom/emotionMapper';
import { EMOTION_BRAIN_MAPPING, type EmotionRegionMap } from '@/components/brain/types';
import { logger } from '@/lib/logger';

export interface UseEmotionOverlayReturn {
  emotionData: EmotionOverlayData | null;
  isOverlayActive: boolean;
  isRealtimeMode: boolean;
  isLoading: boolean;
  error: string | null;
  toggleOverlay: () => void;
  toggleRealtimeMode: () => void;
  refreshEmotions: () => Promise<void>;
  getRegionColor: (regionCode: string) => string | null;
  getRegionIntensity: (regionCode: string) => number;
  selectedEmotion: string | null;
  selectEmotion: (emotion: string | null) => void;
}

export function useEmotionOverlay(): UseEmotionOverlayReturn {
  const { user } = useAuth();
  
  const [emotionData, setEmotionData] = useState<EmotionOverlayData | null>(null);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [isRealtimeMode, setIsRealtimeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  
  const realtimeCleanup = useRef<(() => void) | null>(null);
  
  // Charger les émotions
  const refreshEmotions = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchPatientEmotions(user.id);
      
      if (data) {
        setEmotionData(data);
      } else {
        // Générer des données de démo
        const demoEmotions: HumeEmotionScore[] = [
          { name: 'Joy', score: 0.72 },
          { name: 'Anxiety', score: 0.31 },
          { name: 'Sadness', score: 0.15 },
          { name: 'Surprise', score: 0.45 },
        ];
        
        const mappings = mapEmotionsToBrainRegions(demoEmotions);
        
        setEmotionData({
          emotions: demoEmotions,
          mappings,
          timestamp: new Date().toISOString(),
          dominantEmotion: 'joy',
          overallIntensity: 0.41,
        });
      }
    } catch (err) {
      logger.error('Erreur chargement émotions', err as Error, 'EMOTION_OVERLAY');
      setError('Impossible de charger les données émotionnelles');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  useEffect(() => {
    if (isOverlayActive && !emotionData) {
      refreshEmotions();
    }
  }, [isOverlayActive, emotionData, refreshEmotions]);
  
  // Mode temps réel
  useEffect(() => {
    if (isRealtimeMode && isOverlayActive) {
      realtimeCleanup.current = generateRealtimeEmotionStream((data) => {
        setEmotionData(data);
      }, 2000);
      
      logger.info('Mode temps réel activé', {}, 'EMOTION_OVERLAY');
    } else if (realtimeCleanup.current) {
      realtimeCleanup.current();
      realtimeCleanup.current = null;
    }
    
    return () => {
      if (realtimeCleanup.current) {
        realtimeCleanup.current();
      }
    };
  }, [isRealtimeMode, isOverlayActive]);
  
  const toggleOverlay = useCallback(() => {
    setIsOverlayActive(prev => !prev);
  }, []);
  
  const toggleRealtimeMode = useCallback(() => {
    setIsRealtimeMode(prev => !prev);
  }, []);
  
  const selectEmotion = useCallback((emotion: string | null) => {
    setSelectedEmotion(emotion);
  }, []);
  
  // Obtenir la couleur d'une région basée sur les émotions
  const getRegionColor = useCallback((regionCode: string): string | null => {
    if (!isOverlayActive || !emotionData) return null;
    
    // Chercher quelle émotion affecte cette région
    for (const [emotion, data] of Object.entries(emotionData.mappings)) {
      if (!data) continue;
      
      const mapping = EMOTION_BRAIN_MAPPING[emotion.toLowerCase()];
      if (mapping?.regions.some(r => regionCode.includes(r))) {
        // Si une émotion est sélectionnée, ne montrer que celle-là
        if (selectedEmotion && selectedEmotion.toLowerCase() !== emotion.toLowerCase()) {
          continue;
        }
        return data.color;
      }
    }
    
    return null;
  }, [isOverlayActive, emotionData, selectedEmotion]);
  
  // Obtenir l'intensité d'une région
  const getRegionIntensity = useCallback((regionCode: string): number => {
    if (!isOverlayActive || !emotionData) return 0;
    
    for (const [emotion, data] of Object.entries(emotionData.mappings)) {
      if (!data) continue;
      
      const mapping = EMOTION_BRAIN_MAPPING[emotion.toLowerCase()];
      if (mapping?.regions.some(r => regionCode.includes(r))) {
        if (selectedEmotion && selectedEmotion.toLowerCase() !== emotion.toLowerCase()) {
          continue;
        }
        return data.intensity;
      }
    }
    
    return 0;
  }, [isOverlayActive, emotionData, selectedEmotion]);
  
  return {
    emotionData,
    isOverlayActive,
    isRealtimeMode,
    isLoading,
    error,
    toggleOverlay,
    toggleRealtimeMode,
    refreshEmotions,
    getRegionColor,
    getRegionIntensity,
    selectedEmotion,
    selectEmotion,
  };
}
