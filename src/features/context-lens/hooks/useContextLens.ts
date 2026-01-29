/**
 * useContextLens - Hook principal pour le module Context Lens
 * Gestion des insights, patterns et analyses NLP
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contextLensApi } from '../services/contextLensApi';
import type {
  ContextLensInsight,
  EmotionPattern,
  EmotionData,
  NLPAnalysisResult,
  ContextLensReport,
} from '../types';

// ============ INSIGHTS HOOK ============

export function useContextLensInsights(options?: {
  type?: ContextLensInsight['type'];
  limit?: number;
  unreadOnly?: boolean;
}) {
  const queryClient = useQueryClient();

  const { data: insights = [], isLoading, error, refetch } = useQuery({
    queryKey: ['context-lens', 'insights', options],
    queryFn: () => contextLensApi.getInsights(options),
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // 1 minute
  });

  const markReadMutation = useMutation({
    mutationFn: (insightId: string) => contextLensApi.markInsightRead(insightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['context-lens', 'insights'] });
    },
  });

  const unreadCount = useMemo(
    () => insights.filter((i) => !i.is_read).length,
    [insights]
  );

  return {
    insights,
    isLoading,
    error,
    refetch,
    markRead: markReadMutation.mutate,
    unreadCount,
  };
}

// ============ PATTERNS HOOK ============

export function useEmotionPatterns(period: 'week' | 'month' | 'quarter' = 'month') {
  const { data: patterns = [], isLoading, error, refetch } = useQuery({
    queryKey: ['context-lens', 'patterns', period],
    queryFn: () => contextLensApi.getPatterns({ period }),
    staleTime: 5 * 60_000, // 5 minutes
  });

  const detectMutation = useMutation({
    mutationFn: () => contextLensApi.detectPatterns(),
  });

  return {
    patterns,
    isLoading,
    error,
    refetch,
    detectPatterns: detectMutation.mutateAsync,
    isDetecting: detectMutation.isPending,
  };
}

// ============ NLP ANALYSIS HOOK ============

export function useNLPAnalysis() {
  const [result, setResult] = useState<NLPAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyze = useCallback(async (text: string, language?: 'fr' | 'en') => {
    if (!text.trim()) {
      setResult(null);
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await contextLensApi.analyzeText(text, { language });
      setResult(analysis);
      return analysis;
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Analysis failed');
      setError(e);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    isAnalyzing,
    error,
    analyze,
    reset,
  };
}

// ============ EMOTION HISTORY HOOK ============

export function useEmotionHistory(options?: {
  from?: string;
  to?: string;
  interval?: 'hour' | 'day' | 'week';
}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['context-lens', 'emotion-history', options],
    queryFn: () => contextLensApi.getEmotionHistory(options),
    staleTime: 60_000, // 1 minute
  });

  return {
    history: data,
    isLoading,
    error,
    refetch,
  };
}

// ============ CURRENT EMOTIONS HOOK ============

export function useCurrentEmotions(refreshInterval = 5000) {
  const [emotions, setEmotions] = useState<EmotionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmotions = useCallback(async () => {
    try {
      const data = await contextLensApi.getCurrentEmotions();
      setEmotions(data);
    } catch (err) {
      console.error('[Context Lens] Failed to fetch current emotions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmotions();
    const interval = setInterval(fetchEmotions, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchEmotions, refreshInterval]);

  const dominantEmotion = useMemo(() => {
    if (!emotions) return null;
    const { timestamp, ...scores } = emotions;
    const entries = Object.entries(scores).filter(
      ([, v]) => typeof v === 'number'
    ) as [string, number][];
    if (entries.length === 0) return null;
    return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  }, [emotions]);

  return {
    emotions,
    isLoading,
    dominantEmotion,
    refresh: fetchEmotions,
  };
}

// ============ WEEKLY REPORT HOOK ============

export function useWeeklyReport() {
  const [report, setReport] = useState<ContextLensReport | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const generate = useCallback(async () => {
    setStatus('generating');
    setProgress(0);

    try {
      const reportStatus = await contextLensApi.generateWeeklyReport();
      if (!reportStatus) throw new Error('Failed to start report generation');

      // Poll for status
      const pollInterval = setInterval(async () => {
        const s = await contextLensApi.getReportStatus(reportStatus.id);
        if (s) {
          setProgress(s.progress ?? 0);

          if (s.status === 'ready') {
            clearInterval(pollInterval);
            const fullReport = await contextLensApi.getReport(reportStatus.id);
            setReport(fullReport);
            setStatus('ready');
          } else if (s.status === 'error') {
            clearInterval(pollInterval);
            setStatus('error');
          }
        }
      }, 2000);

      // Cleanup timeout
      setTimeout(() => clearInterval(pollInterval), 60_000);
    } catch {
      setStatus('error');
    }
  }, []);

  return {
    report,
    status,
    progress,
    generate,
  };
}

// ============ MAIN CONTEXT LENS HOOK ============

export function useContextLens() {
  const { insights, unreadCount, markRead } = useContextLensInsights();
  const { patterns } = useEmotionPatterns();
  const { emotions, dominantEmotion } = useCurrentEmotions();

  return {
    insights,
    unreadInsights: unreadCount,
    markInsightRead: markRead,
    patterns,
    currentEmotions: emotions,
    dominantEmotion,
  };
}

export default useContextLens;
