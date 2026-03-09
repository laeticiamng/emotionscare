
/**
 * Service d'analyse d'émotions EmotionsCare
 * Connecté aux vraies APIs Supabase et Hume
 */

import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { computeBalanceFromScores } from './emotionScan.service';
import { logger } from '@/lib/logger';

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

class EmotionService {
  /**
   * Analyse d'émotion via API Hume
   */
  async analyzeEmotion(request: EmotionAnalysisRequest): Promise<EmotionAnalysisResponse | null> {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-emotion-analyze', {
        body: {
          type: request.type,
          inputData: request.data,
          context: request.context
        }
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
        user_id: undefined // Will be set by the hook
      };
    } catch (error) {
      logger.error('Unexpected error in emotion analysis:', error, 'SERVICE');
      return null;
    }
  }

  /**
   * Analyse d'émotion textuelle
   */
  async analyzeText(text: string, context?: string): Promise<EmotionAnalysisResponse | null> {
    return this.analyzeEmotion({
      type: 'text',
      data: text,
      context
    });
  }

  /**
   * Analyse d'émotion vocale
   */
  async analyzeVoice(audioFile: File): Promise<EmotionAnalysisResponse | null> {
    return this.analyzeEmotion({
      type: 'voice',
      data: audioFile
    });
  }

  /**
   * Analyse d'émotion via image
   */
  async analyzeImage(imageFile: File): Promise<EmotionAnalysisResponse | null> {
    return this.analyzeEmotion({
      type: 'image',
      data: imageFile
    });
  }

  /**
   * Sauvegarde d'une analyse d'émotion
   */
  async saveEmotionResult(emotion: EmotionAnalysisResponse, userId: string): Promise<EmotionResult | null> {
    try {
      const balance = computeBalanceFromScores(emotion.emotions);
      const { error } = await supabase
        .from('emotion_scans')
        .insert({
          id: emotion.id,
          user_id: userId,
          mood: emotion.emotion,
          confidence: Math.round(emotion.confidence * 100),
          emotions: { scores: emotion.emotions, source: emotion.source },
          summary: `Analyse ${emotion.source}`,
          scan_type: emotion.source,
          emotional_balance: balance,
        });

      if (error) {
        logger.error('Error saving emotion result:', error, 'SERVICE');
        return null;
      }

      return {
        emotion: emotion.emotion,
        confidence: emotion.confidence,
        valence: emotion.emotions.valence ?? 0,
        arousal: emotion.emotions.arousal ?? 0,
        timestamp: new Date(emotion.timestamp),
        insight: undefined,
        suggestions: [],
      } as EmotionResult;
    } catch (error) {
      logger.error('Unexpected error saving emotion result:', error, 'SERVICE');
      return null;
    }
  }

  /**
   * Récupération des émotions récentes d'un utilisateur
   */
  async getUserEmotions(userId: string, limit: number = 20): Promise<EmotionResult[]> {
    try {
      const { data, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Error fetching user emotions:', error, 'SERVICE');
        return [];
      }

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
      logger.error('Unexpected error fetching user emotions:', error, 'SERVICE');
      return [];
    }
  }

  /**
   * Analyse des tendances émotionnelles
   */
  async getEmotionTrends(userId: string, days: number = 7): Promise<{
    dominant_emotion: string;
    average_confidence: number;
    emotion_distribution: Record<string, number>;
    trend: 'improving' | 'stable' | 'declining';
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('emotion-analytics', {
        body: {
          userId,
          days,
          analysis_type: 'trends'
        }
      });

      if (error) {
        logger.error('Error fetching emotion trends:', error, 'SERVICE');
        return {
          dominant_emotion: 'neutral',
          average_confidence: 0.5,
          emotion_distribution: { neutral: 1.0 },
          trend: 'stable'
        };
      }

      return data;
    } catch (error) {
      logger.error('Unexpected error fetching emotion trends:', error, 'SERVICE');
      return {
        dominant_emotion: 'neutral',
        average_confidence: 0.5,
        emotion_distribution: { neutral: 1.0 },
        trend: 'stable'
      };
    }
  }

  /**
   * Recommandations basées sur l'émotion
   */
  async getEmotionRecommendations(emotion: string, intensity: number): Promise<{
    activities: string[];
    music_style: string;
    exercises: string[];
    tips: string[];
  }> {
    const recommendations = {
      sad: {
        activities: ['Méditation guidée', 'Écriture expressive', 'Marche en nature'],
        music_style: 'calm',
        exercises: ['Respiration profonde', 'Yoga doux', 'Étirements'],
        tips: ['Accordez-vous de la bienveillance', 'Contactez un proche', 'Pratiquez la gratitude']
      },
      happy: {
        activities: ['Danse', 'Créativité', 'Partage social'],
        music_style: 'energetic',
        exercises: ['Cardio léger', 'Mouvements dynamiques', 'Sport'],
        tips: ['Savourez ce moment', 'Partagez votre joie', 'Ancrez cette émotion positive']
      },
      angry: {
        activities: ['Exercice physique', 'Écriture', 'Art thérapie'],
        music_style: 'soothing',
        exercises: ['HIIT court', 'Boxe virtuelle', 'Course'],
        tips: ['Prenez du recul', 'Respirez profondément', 'Exprimez-vous sainement']
      },
      anxious: {
        activities: ['Méditation', 'Lecture', 'Activité manuelle'],
        music_style: 'ambient',
        exercises: ['Respiration 4-7-8', 'Progressive muscle relaxation', 'Grounding'],
        tips: ['Restez dans le présent', 'Limitez la caféine', 'Parlez à quelqu\'un']
      },
      neutral: {
        activities: ['Exploration créative', 'Apprentissage', 'Planning'],
        music_style: 'focus',
        exercises: ['Étirements', 'Marche consciente', 'Yoga'],
        tips: ['Profitez de cette stabilité', 'Explorez de nouvelles activités', 'Préparez vos projets']
      }
    };

    return recommendations[emotion as keyof typeof recommendations] || recommendations.neutral;
  }

  /**
   * Conversion d'émotion en emojis
   */
  private getEmojisForEmotion(emotion: string): string[] {
    const emojiMap: Record<string, string[]> = {
      happy: ['😊', '😄', '🙂', '😃'],
      sad: ['😢', '😞', '😔', '🥲'],
      angry: ['😠', '😡', '🤬', '😤'],
      fear: ['😨', '😰', '😱', '😟'],
      surprise: ['😲', '😮', '🤩', '😯'],
      disgust: ['🤢', '😖', '😒', '🙄'],
      neutral: ['😐', '😑', '🙂', '😶'],
      calm: ['😌', '😇', '🧘', '✨'],
      excited: ['🤗', '🎉', '🙌', '⭐'],
      anxious: ['😅', '😓', '😬', '🤯'],
      content: ['😊', '☺️', '🥰', '💕'],
      frustrated: ['😤', '🤨', '😫', '🙄']
    };

    return emojiMap[emotion.toLowerCase()] || emojiMap.neutral;
  }
}

export const emotionService = new EmotionService();
export default emotionService;