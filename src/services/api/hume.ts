// @ts-nocheck
/**
 * Service Hume AI optimisé - Architecture minimale EmotionsCare
 * Couvre: émotions voix/visage/prosodie
 */

import { supabase } from '@/integrations/supabase/client';

export interface HumeEmotionData {
  name: string;
  score: number;
}

export interface HumeFaceResponse {
  emotions: HumeEmotionData[];
  dominant_emotion: string;
  confidence: number;
  bounding_box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface HumeVoiceResponse {
  emotions: HumeEmotionData[];
  dominant_emotion: string;
  confidence: number;
  prosody?: {
    pitch: number;
    energy: number;
    tempo: number;
  };
}

export interface HumeWeeklyStats {
  period: string;
  emotions_detected: number;
  dominant_emotions: Record<string, number>;
  trend: 'positive' | 'neutral' | 'negative';
}

class HumeService {
  /**
   * Analyse émotion visage - pour Scan Émotionnel, Filtres Visage AR
   */
  async analyzeFace(imageBlob: Blob): Promise<HumeFaceResponse> {
    const formData = new FormData();
    formData.append('image', imageBlob);

    const { data, error } = await supabase.functions.invoke('hume-face', {
      body: formData
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de l\'analyse faciale');
    }

    return data;
  }

  /**
   * Analyse émotion voix - pour Journal voix, prosodie
   */
  async analyzeVoice(audioBlob: Blob): Promise<HumeVoiceResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const { data, error } = await supabase.functions.invoke('hume-voice', {
      body: formData
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de l\'analyse vocale');
    }

    return data;
  }

  /**
   * Stats hebdomadaires - pour Quick Nudge (accueil)
   */
  async getWeeklyStats(userId: string): Promise<HumeWeeklyStats> {
    const { data, error } = await supabase.functions.invoke('hume-weekly-stats', {
      body: { user_id: userId }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la récupération des stats');
    }

    return data;
  }

  /**
   * Fallback générique pour situations sans capteur
   */
  getFallbackEmotions(context?: {
    timeOfDay?: string;
    activity?: string;
  }): HumeEmotionData[] {
    const baseEmotions = [
      { name: 'calm', score: 0.6 },
      { name: 'neutral', score: 0.8 },
      { name: 'focused', score: 0.5 }
    ];

    // Ajustement selon contexte
    if (context?.timeOfDay === 'morning') {
      baseEmotions.push({ name: 'energized', score: 0.7 });
    } else if (context?.timeOfDay === 'evening') {
      baseEmotions.push({ name: 'relaxed', score: 0.6 });
    }

    return baseEmotions;
  }

  /**
   * Étiquettes émotionnelles pour fallback UI
   */
  getEmotionLabel(dominantEmotion: string): string {
    const labels: Record<string, string> = {
      joy: '😊 Positif',
      sadness: '😔 Pensif',
      anger: '😤 Énergique',
      fear: '😰 Inquiet',
      surprise: '😮 Surpris',
      disgust: '😒 Critique',
      calm: '😌 Calme',
      neutral: '😐 Neutre',
      focused: '🎯 Concentré',
      energized: '⚡ Énergique',
      relaxed: '😴 Détendu'
    };

    return labels[dominantEmotion] || '🙂 Présent';
  }
}

export const humeService = new HumeService();