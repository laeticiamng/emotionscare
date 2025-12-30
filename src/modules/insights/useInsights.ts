/**
 * Module Insights - Hook
 * Hook React pour gérer les insights IA
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { InsightsService } from './insightsService';
import type { Insight, InsightStats, InsightFilters, InsightGenerationContext } from './types';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

export function useInsights(filters?: InsightFilters) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [stats, setStats] = useState<InsightStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load insights
  const loadInsights = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const [insightsData, statsData] = await Promise.all([
        InsightsService.getUserInsights(user.id, filters),
        InsightsService.getInsightStats(user.id)
      ]);

      setInsights(insightsData);
      setStats(statsData);
    } catch (err) {
      logger.error('[useInsights] Load failed:', err as Error, 'HOOK');
      setError('Impossible de charger les insights');
    } finally {
      setLoading(false);
    }
  }, [user?.id, filters]);

  // Initial load
  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('insights-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_insights',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadInsights();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, loadInsights]);

  // Apply insight
  const applyInsight = useCallback(async (insightId: string) => {
    if (!user?.id) return;

    try {
      await InsightsService.applyInsight(insightId, user.id);
      setInsights(prev => prev.map(i => 
        i.id === insightId 
          ? { ...i, status: 'applied', is_read: true } 
          : i
      ));
    } catch (err) {
      logger.error('[useInsights] Apply failed:', err as Error, 'HOOK');
      throw err;
    }
  }, [user?.id]);

  // Dismiss insight
  const dismissInsight = useCallback(async (insightId: string) => {
    if (!user?.id) return;

    try {
      await InsightsService.dismissInsight(insightId, user.id);
      setInsights(prev => prev.filter(i => i.id !== insightId));
    } catch (err) {
      logger.error('[useInsights] Dismiss failed:', err as Error, 'HOOK');
      throw err;
    }
  }, [user?.id]);

  // Schedule reminder
  const scheduleReminder = useCallback(async (insightId: string, remindAt?: Date) => {
    if (!user?.id) return;

    const reminderDate = remindAt || new Date(Date.now() + 24 * 60 * 60 * 1000); // Default: tomorrow

    try {
      await InsightsService.scheduleReminder(insightId, user.id, reminderDate);
      setInsights(prev => prev.map(i => 
        i.id === insightId 
          ? { ...i, status: 'reminded', reminded_at: reminderDate.toISOString() } 
          : i
      ));
    } catch (err) {
      logger.error('[useInsights] Schedule reminder failed:', err as Error, 'HOOK');
      throw err;
    }
  }, [user?.id]);

  // Mark as read
  const markAsRead = useCallback(async (insightId: string) => {
    try {
      await InsightsService.markAsRead(insightId);
      setInsights(prev => prev.map(i => 
        i.id === insightId 
          ? { ...i, is_read: true, status: 'read' } 
          : i
      ));
    } catch (err) {
      logger.error('[useInsights] Mark as read failed:', err as Error, 'HOOK');
    }
  }, []);

  // Generate new insights
  const generateInsights = useCallback(async (context?: Partial<InsightGenerationContext>) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Build context from user data
      const fullContext: InsightGenerationContext = {
        userId: user.id,
        ...context
      };

      // Get recent emotional data
      const { data: scans } = await supabase
        .from('emotional_scans')
        .select('primary_emotion, confidence_score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (scans?.length) {
        fullContext.recentEmotions = scans.map(s => ({
          emotion: s.primary_emotion || 'unknown',
          score: (s.confidence_score || 0.5) * 10,
          date: s.created_at
        }));
      }

      // Get session data
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: sessions } = await supabase
        .from('session_tracking')
        .select('session_type, duration_seconds')
        .eq('user_id', user.id)
        .gte('started_at', weekAgo.toISOString());

      if (sessions?.length) {
        fullContext.sessionData = {
          breathingMinutes: Math.round(
            sessions
              .filter(s => s.session_type === 'breathwork')
              .reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60
          ),
          meditationMinutes: Math.round(
            sessions
              .filter(s => s.session_type === 'meditation')
              .reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60
          ),
          musicSessions: sessions.filter(s => s.session_type === 'music').length
        };
      }

      // Get journal count
      const { count: journalCount } = await supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString());

      fullContext.journalSummary = {
        count: journalCount || 0,
        avgMood: 7,
        themes: []
      };

      // Generate insights
      const newInsights = await InsightsService.generateInsights(fullContext);
      
      // Reload all insights
      await loadInsights();

      return newInsights;
    } catch (err) {
      logger.error('[useInsights] Generate failed:', err as Error, 'HOOK');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id, loadInsights]);

  return {
    insights,
    stats,
    loading,
    error,
    applyInsight,
    dismissInsight,
    scheduleReminder,
    markAsRead,
    generateInsights,
    reload: loadInsights
  };
}
