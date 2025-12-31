/**
 * useEmotionScanHistory - Hook unifié pour l'historique des scans émotionnels
 * Combine les données de plusieurs sources et fournit des analyses
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useCallback, useMemo } from 'react';

export interface EmotionScanHistoryItem {
  id: string;
  userId: string;
  source: 'camera' | 'voice' | 'text' | 'sliders' | 'emoji' | 'SAM';
  valence: number;
  arousal: number;
  dominantEmotion: string;
  confidence: number;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export interface EmotionTrend {
  period: 'day' | 'week' | 'month';
  averageValence: number;
  averageArousal: number;
  dominantEmotions: string[];
  scanCount: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface EmotionInsight {
  type: 'pattern' | 'recommendation' | 'milestone';
  title: string;
  description: string;
  confidence: number;
  actionable?: boolean;
}

export function useEmotionScanHistory(options: {
  limit?: number;
  source?: string;
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const queryClient = useQueryClient();
  const { limit = 50, source, startDate, endDate } = options;

  // Fetch scan history
  const { data: history = [], isLoading, error, refetch } = useQuery({
    queryKey: ['emotion-scan-history', limit, source, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async (): Promise<EmotionScanHistoryItem[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from('clinical_signals')
        .select('id, user_id, source_instrument, metadata, created_at')
        .eq('user_id', user.id)
        .eq('domain', 'emotional')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (source) {
        query = query.eq('source_instrument', source);
      }

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        logger.error('[useEmotionScanHistory] Fetch error:', error, 'HOOK');
        throw error;
      }

      return (data || []).map((item): EmotionScanHistoryItem => {
        const meta = item.metadata as Record<string, unknown> || {};
        return {
          id: item.id,
          userId: item.user_id,
          source: mapSourceInstrument(item.source_instrument),
          valence: Number(meta.valence) || 50,
          arousal: Number(meta.arousal) || 50,
          dominantEmotion: String(meta.summary || meta.emotion || 'neutre'),
          confidence: Number(meta.confidence) || 75,
          createdAt: new Date(item.created_at),
          metadata: meta
        };
      });
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000
  });

  // Delete scan mutation
  const deleteScanMutation = useMutation({
    mutationFn: async (scanId: string) => {
      const { error } = await supabase
        .from('clinical_signals')
        .delete()
        .eq('id', scanId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotion-scan-history'] });
      queryClient.invalidateQueries({ queryKey: ['scan-history'] });
    },
    onError: (error) => {
      logger.error('[useEmotionScanHistory] Delete error:', error, 'HOOK');
    }
  });

  // Calculate trends
  const trends = useMemo((): EmotionTrend | null => {
    if (history.length < 3) return null;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentScans = history.filter(s => s.createdAt >= weekAgo);

    if (recentScans.length === 0) return null;

    const avgValence = recentScans.reduce((sum, s) => sum + s.valence, 0) / recentScans.length;
    const avgArousal = recentScans.reduce((sum, s) => sum + s.arousal, 0) / recentScans.length;

    // Count emotions
    const emotionCounts: Record<string, number> = {};
    recentScans.forEach(s => {
      const emotion = s.dominantEmotion.toLowerCase();
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const sortedEmotions = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion);

    // Determine trend by comparing first and second half
    const midpoint = Math.floor(recentScans.length / 2);
    const firstHalf = recentScans.slice(midpoint);
    const secondHalf = recentScans.slice(0, midpoint);

    const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.valence, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s.valence, 0) / secondHalf.length;

    let trend: 'improving' | 'stable' | 'declining';
    if (secondHalfAvg - firstHalfAvg > 5) {
      trend = 'improving';
    } else if (firstHalfAvg - secondHalfAvg > 5) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }

    return {
      period: 'week',
      averageValence: Math.round(avgValence),
      averageArousal: Math.round(avgArousal),
      dominantEmotions: sortedEmotions,
      scanCount: recentScans.length,
      trend
    };
  }, [history]);

  // Generate insights
  const insights = useMemo((): EmotionInsight[] => {
    const result: EmotionInsight[] = [];

    if (history.length === 0) return result;

    // Pattern: Most common emotion
    const emotionCounts: Record<string, number> = {};
    history.forEach(s => {
      const emotion = s.dominantEmotion.toLowerCase();
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const topEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0];

    if (topEmotion) {
      const percentage = Math.round((topEmotion[1] / history.length) * 100);
      result.push({
        type: 'pattern',
        title: `Émotion dominante: ${topEmotion[0]}`,
        description: `Vous ressentez "${topEmotion[0]}" dans ${percentage}% de vos scans.`,
        confidence: Math.min(95, 50 + percentage)
      });
    }

    // Milestone: Scan count
    if (history.length >= 10) {
      result.push({
        type: 'milestone',
        title: `${history.length} scans réalisés`,
        description: 'Vous avez une bonne régularité dans le suivi de vos émotions.',
        confidence: 90
      });
    }

    // Recommendation based on trends
    if (trends?.trend === 'declining') {
      result.push({
        type: 'recommendation',
        title: 'Tendance à surveiller',
        description: 'Votre bien-être émotionnel semble en baisse. Essayez une séance de respiration ou de musique thérapeutique.',
        confidence: 75,
        actionable: true
      });
    }

    // High consistency
    const avgConfidence = history.reduce((sum, s) => sum + s.confidence, 0) / history.length;
    if (avgConfidence > 80) {
      result.push({
        type: 'pattern',
        title: 'Excellente précision',
        description: `Confiance moyenne de ${Math.round(avgConfidence)}% dans vos scans.`,
        confidence: 90
      });
    }

    return result;
  }, [history, trends]);

  // Stats summary
  const stats = useMemo(() => {
    if (history.length === 0) return null;

    const sources = [...new Set(history.map(s => s.source))];
    const avgValence = history.reduce((sum, s) => sum + s.valence, 0) / history.length;
    const avgArousal = history.reduce((sum, s) => sum + s.arousal, 0) / history.length;

    return {
      totalScans: history.length,
      sources,
      averageValence: Math.round(avgValence),
      averageArousal: Math.round(avgArousal),
      dateRange: {
        from: history[history.length - 1]?.createdAt,
        to: history[0]?.createdAt
      }
    };
  }, [history]);

  const deleteScan = useCallback((scanId: string) => {
    return deleteScanMutation.mutateAsync(scanId);
  }, [deleteScanMutation]);

  return {
    history,
    isLoading,
    error,
    refetch,
    trends,
    insights,
    stats,
    deleteScan,
    isDeleting: deleteScanMutation.isPending
  };
}

// Helper function to map source instruments
function mapSourceInstrument(source: string): EmotionScanHistoryItem['source'] {
  const mapping: Record<string, EmotionScanHistoryItem['source']> = {
    'scan_camera': 'camera',
    'scan_voice': 'voice',
    'voice': 'voice',
    'scan_text': 'text',
    'text': 'text',
    'scan_sliders': 'sliders',
    'scan_emoji': 'emoji',
    'SAM': 'SAM'
  };
  return mapping[source] || 'sliders';
}

export default useEmotionScanHistory;
