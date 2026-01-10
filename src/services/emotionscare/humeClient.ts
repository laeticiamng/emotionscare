/**
 * Hume Client pour EmotionsCare
 * Corrigé: Utilise Edge Function hume-analysis au lieu d'appels API directs
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface HumeEmotionScore {
  name: string;
  score: number;
}

/** Simple in‑memory LRU cache (200 entries) */
class LRU<T> {
  private data = new Map<string, T>();
  constructor(private readonly max = 200) {}
  
  get(key: string) { 
    return this.data.get(key); 
  }
  
  set(key: string, val: T) {
    if (this.data.size >= this.max) {
      const firstKey = this.data.keys().next().value;
      if (firstKey) this.data.delete(firstKey);
    }
    this.data.set(key, val);
  }
}

export class HumeClient {
  private cache = new LRU<HumeEmotionScore[]>();
  
  constructor() {
    // Pas besoin de clé API - on utilise Edge Function
  }

  /** Détecte la distribution émotionnelle d'un snippet de texte (≤ 5 000 chars). */
  async detectEmotion(text: string): Promise<HumeEmotionScore[]> {
    const key = text.slice(0, 128);
    const cached = this.cache.get(key);
    if (cached) return cached;

    try {
      // Appel via Edge Function sécurisée
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: {
          text,
          analysisType: 'text_emotion',
        },
      });

      if (error) throw error;

      // Extraire les émotions de la réponse
      const emotions: HumeEmotionScore[] = data?.emotions || 
        data?.predictions?.emotions || 
        this.generateFallbackEmotions(text);
      
      this.cache.set(key, emotions);
      return emotions;
    } catch (error) {
      logger.warn('Hume Edge Function failed, using fallback', error as Error, 'Hume');
      const fallback = this.generateFallbackEmotions(text);
      this.cache.set(key, fallback);
      return fallback;
    }
  }

  /**
   * Analyse les émotions d'un fichier audio via Edge Function
   */
  async analyzeAudio(audioBlob: Blob): Promise<HumeEmotionScore[]> {
    try {
      // Convertir le blob en base64
      const buffer = await audioBlob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: {
          audio: base64,
          analysisType: 'audio_emotion',
        },
      });

      if (error) throw error;

      return data?.emotions || this.generateFallbackEmotions('');
    } catch (error) {
      logger.warn('Hume audio analysis failed', error as Error, 'Hume');
      return this.generateFallbackEmotions('');
    }
  }

  /**
   * Analyse les émotions d'une image (visage) via Edge Function
   */
  async analyzeFace(imageBlob: Blob): Promise<HumeEmotionScore[]> {
    try {
      const buffer = await imageBlob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: {
          image: base64,
          analysisType: 'face_emotion',
        },
      });

      if (error) throw error;

      return data?.emotions || this.generateFallbackEmotions('');
    } catch (error) {
      logger.warn('Hume face analysis failed', error as Error, 'Hume');
      return this.generateFallbackEmotions('');
    }
  }

  /**
   * Génère des émotions de fallback basées sur une analyse locale simple
   */
  private generateFallbackEmotions(text: string): HumeEmotionScore[] {
    const lowerText = text.toLowerCase();
    
    // Mots-clés émotionnels
    const emotionKeywords: Record<string, string[]> = {
      'Joy': ['heureux', 'joie', 'content', 'génial', 'super', 'love', 'happy', 'well'],
      'Sadness': ['triste', 'malheureux', 'déçu', 'pleure', 'sad', 'cry', 'alone'],
      'Anger': ['colère', 'énervé', 'furieux', 'rage', 'angry', 'mad', 'frustré'],
      'Fear': ['peur', 'anxieux', 'angoisse', 'terreur', 'afraid', 'scared', 'worried'],
      'Surprise': ['surpris', 'étonné', 'wow', 'incroyable', 'surprised', 'amazing'],
      'Disgust': ['dégoût', 'horrible', 'nul', 'déteste', 'disgusted', 'hate'],
      'Contempt': ['mépris', 'dédain', 'arrogant', 'contempt'],
      'Calmness': ['calme', 'serein', 'paisible', 'tranquille', 'calm', 'peaceful'],
    };

    const emotions: HumeEmotionScore[] = [];
    let totalScore = 0;

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matchCount = keywords.filter(kw => lowerText.includes(kw)).length;
      const score = Math.min(0.9, matchCount * 0.2);
      
      emotions.push({ name: emotion, score });
      totalScore += score;
    }

    // Normaliser si pas de match, ajouter une émotion neutre dominante
    if (totalScore < 0.3) {
      return [
        { name: 'Calmness', score: 0.5 },
        { name: 'Interest', score: 0.3 },
        { name: 'Concentration', score: 0.2 },
      ];
    }

    // Trier par score décroissant
    return emotions.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  /**
   * Obtenir l'émotion dominante à partir d'une liste
   */
  getDominantEmotion(emotions: HumeEmotionScore[]): HumeEmotionScore | null {
    if (!emotions.length) return null;
    return emotions.reduce((max, e) => e.score > max.score ? e : max, emotions[0]);
  }

  /**
   * Calculer valence et arousal à partir des émotions
   */
  calculateValenceArousal(emotions: HumeEmotionScore[]): { valence: number; arousal: number } {
    // Mapping émotions vers valence/arousal
    const emotionMapping: Record<string, { valence: number; arousal: number }> = {
      'Joy': { valence: 0.8, arousal: 0.6 },
      'Excitement': { valence: 0.7, arousal: 0.9 },
      'Interest': { valence: 0.5, arousal: 0.5 },
      'Calmness': { valence: 0.6, arousal: 0.2 },
      'Sadness': { valence: -0.6, arousal: 0.3 },
      'Anger': { valence: -0.5, arousal: 0.8 },
      'Fear': { valence: -0.7, arousal: 0.7 },
      'Disgust': { valence: -0.6, arousal: 0.4 },
      'Contempt': { valence: -0.4, arousal: 0.3 },
      'Surprise': { valence: 0.1, arousal: 0.8 },
    };

    let totalValence = 0;
    let totalArousal = 0;
    let totalWeight = 0;

    for (const emotion of emotions) {
      const mapping = emotionMapping[emotion.name];
      if (mapping) {
        totalValence += mapping.valence * emotion.score;
        totalArousal += mapping.arousal * emotion.score;
        totalWeight += emotion.score;
      }
    }

    if (totalWeight === 0) {
      return { valence: 0, arousal: 0.5 };
    }

    return {
      valence: Math.max(-1, Math.min(1, totalValence / totalWeight)),
      arousal: Math.max(0, Math.min(1, totalArousal / totalWeight)),
    };
  }
}

// Singleton instance
let humeClientInstance: HumeClient | null = null;

export function getHumeClient(): HumeClient {
  if (!humeClientInstance) {
    humeClientInstance = new HumeClient();
  }
  return humeClientInstance;
}

// Export par défaut
export default HumeClient;
