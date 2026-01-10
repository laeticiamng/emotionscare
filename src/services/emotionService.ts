/**
 * EmotionService - Service d'analyse émotionnelle
 * Utilise les Edge Functions Supabase pour toutes les analyses
 */

import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { logger } from '@/lib/logger';

export class EmotionService {
  /**
   * Analyse le texte pour détecter les émotions
   */
  static async analyzeText(text: string): Promise<EmotionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: { 
          input_type: 'text',
          raw_input: text,
          intensity: 5,
          context_tags: []
        }
      });

      if (error) throw error;

      return {
        emotion: data.primaryEmotion || 'neutral',
        confidence: 0.85,
        valence: data.valence || 0,
        arousal: data.arousal || 0,
        source: 'text',
        timestamp: new Date(),
        transcription: text,
        sentiment: data.valence > 0 ? 'positive' : data.valence < 0 ? 'negative' : 'neutral',
        details: {
          detectedEmotions: data.detectedEmotions || [],
          summary: data.summary
        }
      };
    } catch (error) {
      logger.error('Erreur analyse texte', error as Error, 'SCAN');
      throw new Error('Erreur lors de l\'analyse du texte');
    }
  }

  /**
   * Analyse l'audio pour détecter les émotions
   */
  static async analyzeAudio(audioBlob: Blob): Promise<EmotionResult> {
    try {
      const audioData = await this.blobToBase64(audioBlob);
      
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { 
          audioData, 
          analysisType: 'voice' 
        }
      });

      if (error) throw error;

      const analysis = data?.analysis || {};

      return {
        emotion: analysis.dominant_emotion || 'neutral',
        confidence: analysis.confidence_score || 0.7,
        valence: 0,
        arousal: 0,
        source: 'voice',
        timestamp: new Date(),
        transcription: data.transcription,
        sentiment: analysis.overall_sentiment || 'neutral',
        details: {
          emotions: analysis.emotions,
          processingTime: analysis.processing_time
        }
      };
    } catch (error) {
      logger.error('Erreur analyse audio', error as Error, 'SCAN');
      throw new Error('Erreur lors de l\'analyse audio');
    }
  }

  /**
   * Analyse une image faciale pour détecter les émotions
   */
  static async analyzeFacial(imageData: string): Promise<EmotionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { 
          imageBase64: imageData, 
          analysisType: 'facial' 
        }
      });

      if (error) throw error;

      const analysis = data?.analysis || {};

      return {
        emotion: analysis.dominant_emotion || 'neutral',
        confidence: analysis.confidence_score || 0.75,
        valence: 0,
        arousal: 0,
        source: 'facial',
        timestamp: new Date(),
        details: {
          emotions: analysis.emotions,
          processingTime: analysis.processing_time
        }
      };
    } catch (error) {
      logger.error('Erreur analyse faciale', error as Error, 'SCAN');
      throw new Error('Erreur lors de l\'analyse faciale');
    }
  }

  /**
   * Analyse multimodale combinant plusieurs sources
   */
  static async analyzeMultimodal(options: {
    text?: string;
    audioBlob?: Blob;
    imageData?: string;
  }): Promise<EmotionResult> {
    const results: EmotionResult[] = [];

    try {
      if (options.text && options.text.trim().length > 0) {
        const textResult = await this.analyzeText(options.text);
        results.push(textResult);
      }

      if (options.audioBlob) {
        const audioResult = await this.analyzeAudio(options.audioBlob);
        results.push(audioResult);
      }

      if (options.imageData) {
        const facialResult = await this.analyzeFacial(options.imageData);
        results.push(facialResult);
      }

      if (results.length === 0) {
        throw new Error('No valid input provided');
      }

      // Fusion des résultats
      const emotionWeights: Record<string, number> = {};
      let totalConfidence = 0;

      results.forEach(r => {
        const weight = r.confidence || 0.5;
        emotionWeights[r.emotion] = (emotionWeights[r.emotion] || 0) + weight;
        totalConfidence += weight;
      });

      const dominantEmotion = Object.entries(emotionWeights)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

      return {
        emotion: dominantEmotion,
        confidence: totalConfidence / results.length,
        valence: results.reduce((acc, r) => acc + (r.valence || 0), 0) / results.length,
        arousal: results.reduce((acc, r) => acc + (r.arousal || 0), 0) / results.length,
        source: 'multimodal',
        timestamp: new Date(),
        details: {
          sources: results.map(r => ({
            source: r.source,
            emotion: r.emotion,
            confidence: r.confidence
          }))
        }
      };
    } catch (error) {
      logger.error('Erreur analyse multimodale', error as Error, 'SCAN');
      throw error;
    }
  }

  /**
   * Sauvegarde le résultat d'une analyse émotionnelle
   */
  static async saveEmotionResult(result: EmotionResult): Promise<string | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('emotion_scans')
        .insert({
          user_id: userData.user.id,
          emotion: result.emotion,
          confidence: result.confidence,
          source: result.source,
          transcription: result.transcription,
          valence: result.valence,
          arousal: result.arousal,
          scanned_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;

      return data?.id || null;
    } catch (error) {
      logger.error('Erreur sauvegarde', error as Error, 'SCAN');
      return null;
    }
  }

  /**
   * Récupère l'historique des analyses émotionnelles
   */
  static async getEmotionHistory(days: number = 30): Promise<EmotionResult[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userData.user.id)
        .gte('scanned_at', startDate.toISOString())
        .order('scanned_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(scan => ({
        emotion: scan.emotion,
        confidence: scan.confidence,
        valence: scan.valence,
        arousal: scan.arousal,
        source: scan.source,
        timestamp: new Date(scan.scanned_at),
        transcription: scan.transcription
      }));
    } catch (error) {
      logger.error('Erreur récupération historique', error as Error, 'SCAN');
      return [];
    }
  }

  /**
   * Obtient des insights basés sur l'historique émotionnel
   */
  static async getEmotionInsights(): Promise<{
    dominantEmotion: string;
    averageValence: number;
    trend: 'improving' | 'stable' | 'declining';
    recommendations: string[];
  }> {
    try {
      const history = await this.getEmotionHistory(7);
      
      if (history.length === 0) {
        return {
          dominantEmotion: 'neutral',
          averageValence: 0,
          trend: 'stable',
          recommendations: ['Commencez à scanner vos émotions pour obtenir des insights personnalisés.']
        };
      }

      // Calculer l'émotion dominante
      const emotionCounts: Record<string, number> = {};
      let totalValence = 0;

      history.forEach(h => {
        emotionCounts[h.emotion] = (emotionCounts[h.emotion] || 0) + 1;
        totalValence += h.valence || 0;
      });

      const dominantEmotion = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

      const averageValence = totalValence / history.length;

      // Déterminer la tendance
      const recentValence = history.slice(0, 3).reduce((acc, h) => acc + (h.valence || 0), 0) / Math.min(3, history.length);
      const olderValence = history.slice(-3).reduce((acc, h) => acc + (h.valence || 0), 0) / Math.min(3, history.length);

      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (recentValence > olderValence + 0.1) trend = 'improving';
      else if (recentValence < olderValence - 0.1) trend = 'declining';

      // Recommandations basées sur l'émotion dominante
      const recommendations = this.getRecommendationsForEmotion(dominantEmotion);

      return {
        dominantEmotion,
        averageValence,
        trend,
        recommendations
      };
    } catch (error) {
      logger.error('Erreur calcul insights', error as Error, 'SCAN');
      return {
        dominantEmotion: 'neutral',
        averageValence: 0,
        trend: 'stable',
        recommendations: []
      };
    }
  }

  private static getRecommendationsForEmotion(emotion: string): string[] {
    const recommendations: Record<string, string[]> = {
      joy: ['Continuez à cultiver ces moments positifs', 'Partagez votre joie avec vos proches'],
      sadness: ['Accordez-vous du temps pour vous', 'Essayez une activité qui vous fait habituellement du bien'],
      anxiety: ['Pratiquez des exercices de respiration', 'Une courte méditation pourrait vous aider'],
      anger: ['Prenez un moment pour vous calmer', 'L\'exercice physique peut aider à libérer la tension'],
      fear: ['Identifiez la source de votre inquiétude', 'Parlez-en à quelqu\'un de confiance'],
      neutral: ['Explorez de nouvelles activités', 'C\'est un bon moment pour la réflexion']
    };

    return recommendations[emotion.toLowerCase()] || recommendations.neutral;
  }

  private static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export default EmotionService;
