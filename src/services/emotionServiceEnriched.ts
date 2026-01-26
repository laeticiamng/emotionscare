/**
 * EmotionService ENRICHED - Service d'émotions complet
 * Version enrichie avec favoris, export, comparaison de tendances
 */

import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { logger } from '@/lib/logger';

const FAVORITES_KEY = 'emotion-favorites';

interface EmotionFavorite {
  id: string;
  emotion: string;
  context: string;
  savedAt: string;
  note?: string;
}

function getFavorites(): EmotionFavorite[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch { return []; }
}

function saveFavorites(favorites: EmotionFavorite[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.slice(0, 50)));
}

export interface EmotionAnalysisRequest {
  type: 'text' | 'voice' | 'image';
  data: string | File;
  context?: string;
}

export interface EmotionAnalysisResponse {
  id: string;
  emotion: string;
  confidence: number;
  emotions: Record<string, number>;
  emojis: string[];
  source: string;
  timestamp: string;
  user_id?: string;
}

class EmotionServiceEnriched {
  async analyzeEmotion(request: EmotionAnalysisRequest): Promise<EmotionAnalysisResponse | null> {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-emotion-analyze', {
        body: { type: request.type, inputData: request.data, context: request.context }
      });

      if (error) {
        logger.error('Emotion analysis error:', error, 'SERVICE');
        return null;
      }

      return {
        id: data.id,
        emotion: data.emotion,
        confidence: data.confidence,
        emotions: data.details?.allEmotions?.reduce((acc: Record<string, number>, e: any) => {
          acc[e.name] = e.score;
          return acc;
        }, {}) || { [data.emotion]: data.confidence },
        emojis: this.getEmojisForEmotion(data.emotion),
        source: request.type,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Unexpected error:', error, 'SERVICE');
      return null;
    }
  }

  async analyzeText(text: string, context?: string): Promise<EmotionAnalysisResponse | null> {
    return this.analyzeEmotion({ type: 'text', data: text, context });
  }

  async getUserEmotions(userId: string, limit: number = 20): Promise<EmotionResult[]> {
    try {
      const { data, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data ?? []).map(item => ({
        emotion: item.mood ?? 'Indéterminé',
        confidence: (Number(item.confidence) || 0) / 100,
        valence: 0,
        arousal: 0,
        timestamp: new Date(item.created_at ?? Date.now()),
        insight: item.summary ?? undefined,
        suggestions: item.recommendations ?? [],
      }));
    } catch (error) {
      logger.error('Error fetching emotions:', error, 'SERVICE');
      return [];
    }
  }

  // Favorites
  getFavorites(): EmotionFavorite[] { return getFavorites(); }

  addToFavorites(emotion: string, context: string, note?: string): void {
    const favorite: EmotionFavorite = { id: crypto.randomUUID(), emotion, context, savedAt: new Date().toISOString(), note };
    saveFavorites([favorite, ...getFavorites()]);
  }

  removeFromFavorites(id: string): void {
    saveFavorites(getFavorites().filter(f => f.id !== id));
  }

  // Trends comparison
  async compareTrends(userId: string, period1Days: number, period2Days: number): Promise<{
    period1: { dominant: string; avgConfidence: number };
    period2: { dominant: string; avgConfidence: number };
    improvement: number;
  }> {
    const emotions = await this.getUserEmotions(userId, 100);
    const now = new Date();

    const period1End = new Date(now);
    period1End.setDate(period1End.getDate() - period2Days);
    const period1Start = new Date(period1End);
    period1Start.setDate(period1Start.getDate() - period1Days);

    const period2Start = new Date(now);
    period2Start.setDate(period2Start.getDate() - period2Days);

    const p1Emotions = emotions.filter(e => e.timestamp >= period1Start && e.timestamp < period1End);
    const p2Emotions = emotions.filter(e => e.timestamp >= period2Start);

    const getDominant = (list: EmotionResult[]) => {
      const counts: Record<string, number> = {};
      list.forEach(e => counts[e.emotion] = (counts[e.emotion] || 0) + 1);
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
    };

    const getAvgConfidence = (list: EmotionResult[]) => 
      list.length ? list.reduce((s, e) => s + e.confidence, 0) / list.length : 0;

    const p1Conf = getAvgConfidence(p1Emotions);
    const p2Conf = getAvgConfidence(p2Emotions);

    return {
      period1: { dominant: getDominant(p1Emotions), avgConfidence: p1Conf },
      period2: { dominant: getDominant(p2Emotions), avgConfidence: p2Conf },
      improvement: p2Conf - p1Conf,
    };
  }

  // Export
  async exportData(userId: string): Promise<{ emotions: EmotionResult[]; favorites: EmotionFavorite[]; exportedAt: string }> {
    const emotions = await this.getUserEmotions(userId, 500);
    return { emotions, favorites: getFavorites(), exportedAt: new Date().toISOString() };
  }

  private getEmojisForEmotion(emotion: string): string[] {
    const map: Record<string, string[]> = {
      happy: ['😊', '😄'], sad: ['😢', '😞'], angry: ['😠', '😡'], anxious: ['😅', '😓'],
      neutral: ['😐', '🙂'], calm: ['😌', '🧘'], excited: ['🤗', '🎉'],
    };
    return map[emotion.toLowerCase()] || map.neutral;
  }

  async getEmotionRecommendations(emotion: string): Promise<{ activities: string[]; music_style: string; exercises: string[]; tips: string[] }> {
    const recommendations: Record<string, { activities: string[]; music_style: string; exercises: string[]; tips: string[] }> = {
      sad: { activities: ['Méditation guidée', 'Marche'], music_style: 'calm', exercises: ['Respiration profonde'], tips: ['Bienveillance envers soi'] },
      happy: { activities: ['Danse', 'Partage'], music_style: 'energetic', exercises: ['Cardio'], tips: ['Savourez ce moment'] },
      anxious: { activities: ['Méditation', 'Lecture'], music_style: 'ambient', exercises: ['Respiration 4-7-8'], tips: ['Restez dans le présent'] },
      neutral: { activities: ['Exploration'], music_style: 'focus', exercises: ['Yoga'], tips: ['Profitez de la stabilité'] },
    };
    return recommendations[emotion] || recommendations.neutral;
  }
}

export const emotionServiceEnriched = new EmotionServiceEnriched();
export default emotionServiceEnriched;
