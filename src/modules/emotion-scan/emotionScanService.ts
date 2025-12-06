/**
 * Module Emotion Scan - Service
 * Service centralisant toutes les fonctionnalités de scan émotionnel
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  EmotionScanDB,
  CreateEmotionScan,
  UpdateEmotionScan,
  EmotionScanStats,
  EmotionTrend,
  EmotionResult,
  EmotionAnalysisResult,
  FacialAnalysisResult,
  ScanMode,
  EmotionType
} from './types';

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

export class EmotionScanService {
  /**
   * Créer un nouveau scan émotionnel
   */
  static async createScan(scan: CreateEmotionScan): Promise<EmotionScanDB> {
    const { data, error } = await supabase
      .from('emotion_scans')
      .insert({
        user_id: scan.user_id,
        payload: scan.payload,
        mood_score: scan.mood_score ?? null
      })
      .select()
      .single();

    if (error) {
      logger.error('[EmotionScanService] Create scan error:', error, 'MODULE');
      throw new Error(`Failed to create emotion scan: ${error.message}`);
    }

    return data as EmotionScanDB;
  }

  /**
   * Récupérer un scan par ID
   */
  static async getScanById(scanId: string): Promise<EmotionScanDB | null> {
    const { data, error } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      logger.error('[EmotionScanService] Get scan error:', error, 'MODULE');
      throw new Error(`Failed to get emotion scan: ${error.message}`);
    }

    return data as EmotionScanDB;
  }

  /**
   * Récupérer tous les scans d'un utilisateur
   */
  static async getUserScans(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: 'created_at' | 'mood_score';
      ascending?: boolean;
    }
  ): Promise<EmotionScanDB[]> {
    const {
      limit = 50,
      offset = 0,
      orderBy = 'created_at',
      ascending = false
    } = options || {};

    const { data, error } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', userId)
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('[EmotionScanService] Get user scans error:', error, 'MODULE');
      throw new Error(`Failed to get user scans: ${error.message}`);
    }

    return (data as EmotionScanDB[]) || [];
  }

  /**
   * Mettre à jour un scan
   */
  static async updateScan(
    scanId: string,
    updates: UpdateEmotionScan
  ): Promise<EmotionScanDB> {
    const { data, error } = await supabase
      .from('emotion_scans')
      .update(updates)
      .eq('id', scanId)
      .select()
      .single();

    if (error) {
      logger.error('[EmotionScanService] Update scan error:', error, 'MODULE');
      throw new Error(`Failed to update emotion scan: ${error.message}`);
    }

    return data as EmotionScanDB;
  }

  /**
   * Supprimer un scan
   */
  static async deleteScan(scanId: string): Promise<void> {
    const { error } = await supabase
      .from('emotion_scans')
      .delete()
      .eq('id', scanId);

    if (error) {
      logger.error('[EmotionScanService] Delete scan error:', error, 'MODULE');
      throw new Error(`Failed to delete emotion scan: ${error.message}`);
    }
  }

  // ============================================================================
  // EMOTION ANALYSIS
  // ============================================================================

  /**
   * Analyser l'émotion depuis du texte
   */
  static async analyzeText(
    userId: string,
    text: string,
    options?: { language?: string }
  ): Promise<EmotionResult> {
    const { language = 'fr' } = options || {};

    try {
      // Appeler l'edge function d'analyse textuelle
      const { data: analysisData, error } = await supabase.functions.invoke(
        'emotion-analysis',
        {
          body: { text, language }
        }
      );

      if (error) {
        logger.error('[EmotionScanService] Text analysis error:', error, 'MODULE');
        throw new Error(error.message || 'Failed to analyze text');
      }

      if (!analysisData) {
        throw new Error('No data returned from text analysis');
      }

      const result: EmotionResult = {
        id: crypto.randomUUID(),
        emotion: analysisData.emotion || 'neutral',
        valence: (analysisData.valence || 0.5) * 100,
        arousal: (analysisData.arousal || 0.5) * 100,
        confidence: (analysisData.confidence || 0.7) * 100,
        source: 'text',
        timestamp: new Date().toISOString(),
        summary: analysisData.summary,
        emotions: analysisData.emotions || {},
        metadata: {
          latency_ms: analysisData.latency_ms,
          language
        }
      };

      // Sauvegarder le scan
      await this.createScan({
        user_id: userId,
        payload: {
          text,
          result,
          type: 'text'
        },
        mood_score: Math.round(result.valence)
      });

      return result;
    } catch (error) {
      logger.error('[EmotionScanService] Text analysis failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Analyser l'émotion depuis une image (facial analysis)
   */
  static async analyzeFacial(
    userId: string,
    imageData: string | Blob,
    options?: { includeLandmarks?: boolean }
  ): Promise<FacialAnalysisResult> {
    const { includeLandmarks = false } = options || {};

    try {
      // TODO: Intégrer avec un service de facial analysis (Hume AI, AWS Rekognition, etc.)
      // Pour l'instant, retourner une analyse mock
      const mockResult: FacialAnalysisResult = {
        emotion_scores: [
          { emotion: 'neutral', score: 0.7, confidence: 0.8 },
          { emotion: 'calm', score: 0.5, confidence: 0.7 },
          { emotion: 'happy', score: 0.3, confidence: 0.6 }
        ],
        face_detected: true,
        confidence: 0.8,
        quality_metrics: {
          brightness: 0.7,
          sharpness: 0.8,
          face_size: 0.6
        }
      };

      // Sauvegarder le scan
      await this.createScan({
        user_id: userId,
        payload: {
          result: mockResult,
          type: 'facial',
          include_landmarks: includeLandmarks
        },
        mood_score: Math.round(mockResult.emotion_scores[0].score * 100)
      });

      return mockResult;
    } catch (error) {
      logger.error('[EmotionScanService] Facial analysis failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Analyser l'émotion depuis un enregistrement vocal
   */
  static async analyzeVoice(
    userId: string,
    audioData: Blob,
    options?: { language?: string }
  ): Promise<EmotionResult> {
    const { language = 'fr' } = options || {};

    try {
      // TODO: Intégrer avec un service d'analyse vocale
      // Pour l'instant, retourner une analyse mock
      const mockResult: EmotionResult = {
        id: crypto.randomUUID(),
        emotion: 'calm',
        valence: 60,
        arousal: 40,
        confidence: 75,
        source: 'voice',
        timestamp: new Date().toISOString(),
        summary: 'Voice analysis detected calm emotion with moderate confidence',
        emotions: {
          calm: 0.75,
          neutral: 0.5,
          tired: 0.3
        },
        metadata: {
          duration_ms: audioData.size / 16, // Rough estimate
          language
        }
      };

      // Sauvegarder le scan
      await this.createScan({
        user_id: userId,
        payload: {
          result: mockResult,
          type: 'voice',
          audio_size: audioData.size
        },
        mood_score: Math.round(mockResult.valence)
      });

      return mockResult;
    } catch (error) {
      logger.error('[EmotionScanService] Voice analysis failed:', error, 'MODULE');
      throw error;
    }
  }

  // ============================================================================
  // STATISTICS & ANALYTICS
  // ============================================================================

  /**
   * Récupérer les statistiques de scan pour un utilisateur
   */
  static async getUserStats(userId: string): Promise<EmotionScanStats> {
    try {
      const scans = await this.getUserScans(userId, { limit: 1000 });

      if (scans.length === 0) {
        return {
          user_id: userId,
          total_scans: 0,
          scans_by_mode: {
            text: 0,
            voice: 0,
            image: 0,
            facial: 0,
            realtime: 0
          },
          most_frequent_emotion: 'neutral',
          average_valence: 50,
          average_arousal: 50,
          average_confidence: 0,
          mood_improvement: 0,
          last_scan_date: new Date().toISOString()
        };
      }

      // Analyser les payloads
      const emotionCounts: Record<string, number> = {};
      let totalValence = 0;
      let totalArousal = 0;
      let totalConfidence = 0;
      let validScans = 0;

      const scansByMode: Record<ScanMode, number> = {
        text: 0,
        voice: 0,
        image: 0,
        facial: 0,
        realtime: 0
      };

      scans.forEach((scan) => {
        const payload = scan.payload as Record<string, unknown>;
        const result = payload.result as EmotionResult | undefined;
        const type = payload.type as ScanMode | undefined;

        if (type && scansByMode[type] !== undefined) {
          scansByMode[type]++;
        }

        if (result) {
          const emotion = result.emotion;
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          totalValence += result.valence;
          totalArousal += result.arousal;
          totalConfidence += result.confidence;
          validScans++;
        }
      });

      // Trouver l'émotion la plus fréquente
      const mostFrequent = Object.entries(emotionCounts).sort(
        ([, a], [, b]) => b - a
      )[0];

      // Calculer l'amélioration de l'humeur (mood improvement)
      const scansWithMood = scans.filter((s) => s.mood_score !== null);
      let moodImprovement = 0;
      if (scansWithMood.length >= 2) {
        const firstMood = scansWithMood[scansWithMood.length - 1].mood_score!;
        const lastMood = scansWithMood[0].mood_score!;
        moodImprovement = lastMood - firstMood;
      }

      return {
        user_id: userId,
        total_scans: scans.length,
        scans_by_mode: scansByMode,
        most_frequent_emotion: (mostFrequent?.[0] || 'neutral') as EmotionType,
        average_valence: validScans > 0 ? totalValence / validScans : 50,
        average_arousal: validScans > 0 ? totalArousal / validScans : 50,
        average_confidence: validScans > 0 ? totalConfidence / validScans : 0,
        mood_improvement: moodImprovement,
        last_scan_date: scans[0]?.created_at || new Date().toISOString()
      };
    } catch (error) {
      logger.error('[EmotionScanService] Get stats error:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Récupérer les tendances émotionnelles sur une période
   */
  static async getEmotionTrends(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<EmotionTrend[]> {
    try {
      const { data: scans, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to get emotion trends: ${error.message}`);
      }

      // Grouper par date et émotion
      const trends: Record<string, Record<string, { count: number; totalConf: number }>> = {};

      (scans as EmotionScanDB[]).forEach((scan) => {
        const date = scan.created_at.split('T')[0]; // YYYY-MM-DD
        const payload = scan.payload as Record<string, unknown>;
        const result = payload.result as EmotionResult | undefined;

        if (result) {
          if (!trends[date]) trends[date] = {};
          if (!trends[date][result.emotion]) {
            trends[date][result.emotion] = { count: 0, totalConf: 0 };
          }
          trends[date][result.emotion].count++;
          trends[date][result.emotion].totalConf += result.confidence;
        }
      });

      // Convertir en array de trends
      const trendArray: EmotionTrend[] = [];
      Object.entries(trends).forEach(([date, emotions]) => {
        Object.entries(emotions).forEach(([emotion, data]) => {
          trendArray.push({
            date,
            emotion: emotion as EmotionType,
            count: data.count,
            average_confidence: data.totalConf / data.count
          });
        });
      });

      return trendArray.sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      logger.error('[EmotionScanService] Get trends error:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Récupérer le dernier scan d'un utilisateur
   */
  static async getLatestScan(userId: string): Promise<EmotionScanDB | null> {
    const scans = await this.getUserScans(userId, { limit: 1 });
    return scans.length > 0 ? scans[0] : null;
  }

  /**
   * Compter le nombre de scans d'un utilisateur
   */
  static async countUserScans(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('emotion_scans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      logger.error('[EmotionScanService] Count scans error:', error, 'MODULE');
      return 0;
    }

    return count || 0;
  }
}

export const emotionScanService = EmotionScanService;
export default EmotionScanService;
