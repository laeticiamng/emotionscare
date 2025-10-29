import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmotionState, FusedMoodResult } from '@/types/realtime-emotion';
import { useVisionEmotion } from './useVisionEmotion';
import { useVoiceEmotion } from './useVoiceEmotion';
import { useTextEmotion } from './useTextEmotion';

export const useEmotionFusion = () => {
  const vision = useVisionEmotion();
  const voice = useVoiceEmotion();
  const text = useTextEmotion();

  const [emotionState, setEmotionState] = useState<EmotionState>({
    vision: null,
    voice: null,
    text: null,
    fused: null,
    isActive: false,
    latency: {
      vision: 0,
      voice: 0,
      text: 0,
      fusion: 0
    }
  });

  // Fusionner les émotions à chaque changement
  const fuseEmotions = useCallback(async () => {
    if (!vision.lastResult && !voice.lastResult && !text.lastResult) {
      return;
    }

    try {
      const startTime = Date.now();

      const { data, error } = await supabase.functions.invoke('fuse-emotions', {
        body: {
          voice: voice.lastResult ? {
            emotions: voice.lastResult.emotions,
            confidence: voice.lastResult.confidence,
            timestamp: voice.lastResult.timestamp
          } : undefined,
          vision: vision.lastResult ? {
            scores: vision.lastResult.scores,
            confidence: vision.lastResult.confidence,
            timestamp: vision.lastResult.timestamp
          } : undefined,
          text: text.lastResult ? {
            label: text.lastResult.label,
            sentiment: text.lastResult.sentiment,
            confidence: text.lastResult.confidence,
            timestamp: text.lastResult.timestamp
          } : undefined
        }
      });

      if (error) throw error;

      const fusedResult: FusedMoodResult = {
        mood_index: data.mood_index,
        label: data.label,
        confidences: data.confidences,
        timestamp: Date.now(),
        latency_ms: Date.now() - startTime
      };

      setEmotionState(prev => ({
        ...prev,
        fused: fusedResult,
        latency: {
          ...prev.latency,
          fusion: fusedResult.latency_ms
        }
      }));

    } catch (error) {
      console.error('[useEmotionFusion] Fusion error:', error);
    }
  }, [vision.lastResult, voice.lastResult, text.lastResult]);

  // Mettre à jour l'état à chaque changement
  useEffect(() => {
    setEmotionState(prev => ({
      ...prev,
      vision: vision.lastResult,
      voice: voice.lastResult,
      text: text.lastResult,
      isActive: vision.isActive || voice.isActive,
      latency: {
        vision: vision.latency,
        voice: voice.latency,
        text: text.latency,
        fusion: prev.latency.fusion
      }
    }));

    // Fusionner automatiquement
    fuseEmotions();
  }, [vision.lastResult, voice.lastResult, text.lastResult, vision.isActive, voice.isActive, vision.latency, voice.latency, text.latency, fuseEmotions]);

  const startAll = useCallback(async () => {
    await Promise.all([
      vision.start(),
      voice.start()
    ]);
  }, [vision, voice]);

  const stopAll = useCallback(() => {
    vision.stop();
    voice.stop();
  }, [vision, voice]);

  return {
    emotionState,
    vision,
    voice,
    text,
    startAll,
    stopAll,
    fuseEmotions
  };
};
