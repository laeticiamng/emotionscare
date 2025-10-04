/**
 * Service pour l'analyse émotionnelle
 */

import { supabase } from '@/integrations/supabase/client';

export interface EmotionScan {
  id: string;
  user_id: string;
  scan_type: 'text' | 'voice' | 'facial';
  input_data: any;
  emotions_detected: any[];
  primary_emotion: string;
  confidence_score: number;
  created_at: string;
}

export class EmotionalScanService {
  /**
   * Analyser un texte
   */
  static async analyzeText(userId: string, text: string): Promise<EmotionScan> {
    const { data, error } = await supabase.functions.invoke('analyze-emotion-text', {
      body: { userId, text }
    });

    if (error) throw error;
    
    // Sauvegarder le résultat
    const { data: scan, error: saveError } = await supabase
      .from('emotion_scans')
      .insert({
        user_id: userId,
        scan_type: 'text',
        input_data: { text },
        emotions_detected: data.emotions,
        primary_emotion: data.primaryEmotion,
        confidence_score: data.confidence
      })
      .select()
      .single();

    if (saveError) throw saveError;
    return scan;
  }

  /**
   * Analyser la voix
   */
  static async analyzeVoice(userId: string, audioBlob: Blob): Promise<EmotionScan> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('userId', userId);

    const { data, error } = await supabase.functions.invoke('analyze-emotion', {
      body: formData
    });

    if (error) throw error;

    const { data: scan, error: saveError } = await supabase
      .from('emotion_scans')
      .insert({
        user_id: userId,
        scan_type: 'voice',
        input_data: { audioSize: audioBlob.size },
        emotions_detected: data.emotions,
        primary_emotion: data.primaryEmotion,
        confidence_score: data.confidence
      })
      .select()
      .single();

    if (saveError) throw saveError;
    return scan;
  }

  /**
   * Récupérer l'historique des scans
   */
  static async fetchHistory(userId: string, limit: number = 50): Promise<EmotionScan[]> {
    const { data, error } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les statistiques émotionnelles
   */
  static async getEmotionStats(userId: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const emotionCounts = new Map<string, number>();
    data?.forEach(scan => {
      emotionCounts.set(
        scan.primary_emotion,
        (emotionCounts.get(scan.primary_emotion) || 0) + 1
      );
    });

    return {
      totalScans: data?.length || 0,
      emotionDistribution: Object.fromEntries(emotionCounts),
      averageConfidence: data?.reduce((sum, s) => sum + s.confidence_score, 0) / (data?.length || 1)
    };
  }
}
