/**
 * Hook pour corréler les données émotionnelles avec la structure temporelle
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTimeBlocks, TimeBlock } from './useTimeBlocks';
import { format, parseISO, getDay, getHours, startOfWeek, endOfWeek, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmotionDataPoint {
  id: string;
  valence: number;
  arousal: number;
  timestamp: string;
  dayOfWeek: number;
  hour: number;
}

interface CorrelationResult {
  blockType: string;
  avgValence: number;
  avgArousal: number;
  dataPoints: number;
  trend: 'positive' | 'negative' | 'neutral';
}

interface DayPattern {
  day: number;
  dayName: string;
  avgValence: number;
  avgArousal: number;
  emotionalLoad: number;
  dominantBlockType: string | null;
}

export function useTimeEmotionCorrelation() {
  const { blocks, blocksByDay } = useTimeBlocks();

  // Fetch emotion scans from last 30 days
  const { data: emotionData = [], isLoading } = useQuery({
    queryKey: ['emotion-scans-correlation'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

      const { data, error } = await supabase
        .from('emotion_scans')
        .select('id, valence, arousal, created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(scan => ({
        id: scan.id,
        valence: scan.valence ?? 0,
        arousal: scan.arousal ?? 50,
        timestamp: scan.created_at,
        dayOfWeek: getDay(parseISO(scan.created_at)),
        hour: getHours(parseISO(scan.created_at)),
      })) as EmotionDataPoint[];
    },
  });

  // Correlate emotions with time block types
  const correlations = useMemo(() => {
    if (blocks.length === 0 || emotionData.length === 0) return [];

    const correlationMap: Record<string, { valenceSum: number; arousalSum: number; count: number }> = {};

    emotionData.forEach(emotion => {
      // Find matching block for this emotion timestamp
      const dayBlocks = blocksByDay[emotion.dayOfWeek] || [];
      const matchingBlock = dayBlocks.find(
        block => emotion.hour >= block.start_hour && emotion.hour < block.start_hour + block.duration_hours
      );

      if (matchingBlock) {
        const type = matchingBlock.block_type;
        if (!correlationMap[type]) {
          correlationMap[type] = { valenceSum: 0, arousalSum: 0, count: 0 };
        }
        correlationMap[type].valenceSum += emotion.valence;
        correlationMap[type].arousalSum += emotion.arousal;
        correlationMap[type].count++;
      }
    });

    const results: CorrelationResult[] = Object.entries(correlationMap).map(([type, data]) => {
      const avgValence = data.valenceSum / data.count;
      const avgArousal = data.arousalSum / data.count;
      
      let trend: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (avgValence > 20) trend = 'positive';
      else if (avgValence < -20) trend = 'negative';

      return {
        blockType: type,
        avgValence,
        avgArousal,
        dataPoints: data.count,
        trend,
      };
    });

    return results.sort((a, b) => b.dataPoints - a.dataPoints);
  }, [blocks, blocksByDay, emotionData]);

  // Calculate daily patterns
  const dayPatterns = useMemo(() => {
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const patterns: DayPattern[] = [];

    for (let day = 0; day < 7; day++) {
      const dayEmotions = emotionData.filter(e => e.dayOfWeek === day);
      const dayBlocks = blocksByDay[day] || [];

      if (dayEmotions.length === 0) {
        patterns.push({
          day,
          dayName: dayNames[day],
          avgValence: 0,
          avgArousal: 50,
          emotionalLoad: 0,
          dominantBlockType: dayBlocks.length > 0 
            ? dayBlocks.reduce((a, b) => a.duration_hours > b.duration_hours ? a : b).block_type 
            : null,
        });
        continue;
      }

      const avgValence = dayEmotions.reduce((sum, e) => sum + e.valence, 0) / dayEmotions.length;
      const avgArousal = dayEmotions.reduce((sum, e) => sum + e.arousal, 0) / dayEmotions.length;
      
      // Emotional load = high arousal + low valence intensity
      const emotionalLoad = dayEmotions.filter(e => e.arousal > 70 || e.valence < -30).length / dayEmotions.length;

      patterns.push({
        day,
        dayName: dayNames[day],
        avgValence,
        avgArousal,
        emotionalLoad,
        dominantBlockType: dayBlocks.length > 0 
          ? dayBlocks.reduce((a, b) => a.duration_hours > b.duration_hours ? a : b).block_type 
          : null,
      });
    }

    return patterns;
  }, [emotionData, blocksByDay]);

  // Find peak emotional moments
  const peakMoments = useMemo(() => {
    if (emotionData.length === 0) return { positive: [], negative: [] };

    const sorted = [...emotionData].sort((a, b) => b.valence - a.valence);
    
    return {
      positive: sorted.slice(0, 3),
      negative: sorted.slice(-3).reverse(),
    };
  }, [emotionData]);

  return {
    correlations,
    dayPatterns,
    peakMoments,
    emotionDataCount: emotionData.length,
    hasData: emotionData.length > 0 && blocks.length > 0,
    isLoading,
  };
}
