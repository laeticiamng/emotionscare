/**
 * Module Insights - Hook
 * Hook React pour gérer les insights IA avec pagination et filtres persistés
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { InsightsService } from './insightsService';
import type { 
  Insight, 
  InsightStats, 
  InsightFilters, 
  InsightGenerationContext,
  InsightFeedback,
  InsightType,
  InsightPriority,
  InsightCategory
} from './types';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'insights_filters';

export function useInsights(initialFilters?: InsightFilters) {
  const { user } = useAuth();
  const [searchParams, _setSearchParams] = useSearchParams();
  
  const [insights, setInsights] = useState<Insight[]>([]);
  const [stats, setStats] = useState<InsightStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState<'created_at' | 'priority' | 'impact_score'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filters - restore from localStorage or URL
  const [filters, setFilters] = useState<InsightFilters>(() => {
    // Try URL params first
    const typeParam = searchParams.get('type');
    const priorityParam = searchParams.get('priority');
    const categoryParam = searchParams.get('category');
    
    if (typeParam || priorityParam || categoryParam) {
      return {
        type: typeParam ? [typeParam as InsightType] : undefined,
        priority: priorityParam ? [priorityParam as InsightPriority] : undefined,
        category: categoryParam ? [categoryParam as InsightCategory] : undefined,
        ...initialFilters
      };
    }

    // Try localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...JSON.parse(stored), ...initialFilters };
      }
    } catch {
      // Ignore parse errors
    }

    return initialFilters || {};
  });

  // Persist filters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // Ignore storage errors
    }
  }, [filters]);

  // Load insights with pagination
  const loadInsights = useCallback(async (resetPage = false) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const currentPage = resetPage ? 1 : page;
      if (resetPage) setPage(1);

      const [result, statsData] = await Promise.all([
        InsightsService.getUserInsights(user.id, filters, {
          page: currentPage,
          limit,
          sortBy,
          sortOrder
        }),
        InsightsService.getInsightStats(user.id)
      ]);

      setInsights(result.insights);
      setTotal(result.total);
      setStats(statsData);
    } catch (err) {
      logger.error('[useInsights] Load failed:', err as Error, 'HOOK');
      setError('Impossible de charger les insights');
    } finally {
      setLoading(false);
    }
  }, [user?.id, filters, page, limit, sortBy, sortOrder]);

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

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<InsightFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page on filter change
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Update sorting
  const updateSort = useCallback((newSortBy: typeof sortBy, newSortOrder?: typeof sortOrder) => {
    setSortBy(newSortBy);
    if (newSortOrder) setSortOrder(newSortOrder);
    setPage(1);
  }, []);

  // Apply insight
  const applyInsight = useCallback(async (insightId: string) => {
    if (!user?.id) return;

    try {
      await InsightsService.applyInsight(insightId, user.id);
      setInsights(prev => prev.map(i => 
        i.id === insightId 
          ? { ...i, status: 'applied', is_read: true, applied_at: new Date().toISOString() } 
          : i
      ));
      // Refresh stats
      const newStats = await InsightsService.getInsightStats(user.id, true);
      setStats(newStats);
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
      setTotal(prev => prev - 1);
      // Refresh stats
      const newStats = await InsightsService.getInsightStats(user.id, true);
      setStats(newStats);
    } catch (err) {
      logger.error('[useInsights] Dismiss failed:', err as Error, 'HOOK');
      throw err;
    }
  }, [user?.id]);

  // Schedule reminder
  const scheduleReminder = useCallback(async (insightId: string, remindAt?: Date) => {
    if (!user?.id) return;

    const reminderDate = remindAt || new Date(Date.now() + 24 * 60 * 60 * 1000);

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
          ? { ...i, is_read: true, status: i.status === 'new' ? 'read' : i.status } 
          : i
      ));
    } catch (err) {
      logger.error('[useInsights] Mark as read failed:', err as Error, 'HOOK');
    }
  }, []);

  // Submit feedback
  const submitFeedback = useCallback(async (feedback: Omit<InsightFeedback, 'user_id'>) => {
    if (!user?.id) return;

    try {
      await InsightsService.submitFeedback({ ...feedback, user_id: user.id });
      setInsights(prev => prev.map(i => 
        i.id === feedback.insight_id 
          ? { ...i, feedback_rating: feedback.rating, feedback_text: feedback.feedback_text } 
          : i
      ));
    } catch (err) {
      logger.error('[useInsights] Submit feedback failed:', err as Error, 'HOOK');
      throw err;
    }
  }, [user?.id]);

  // Export insights
  const exportInsights = useCallback(async (format: 'json' | 'csv') => {
    if (!user?.id) return;

    try {
      const data = await InsightsService.exportInsights(user.id, format);
      
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `insights_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      logger.error('[useInsights] Export failed:', err as Error, 'HOOK');
      throw err;
    }
  }, [user?.id]);

  // Generate new insights
  const generateInsights = useCallback(async (context?: Partial<InsightGenerationContext>) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
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

      // Get goals progress
      const { data: goals } = await supabase
        .from('user_goals')
        .select('id, title, progress')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (goals?.length) {
        fullContext.goals = goals.map(g => ({
          id: g.id,
          title: g.title,
          progress: g.progress || 0
        }));
      }

      // Generate insights
      const newInsights = await InsightsService.generateInsights(fullContext);
      
      // Reload all insights
      await loadInsights(true);

      return newInsights;
    } catch (err) {
      logger.error('[useInsights] Generate failed:', err as Error, 'HOOK');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id, loadInsights]);

  // Computed values
  const hasFilters = useMemo(() => {
    return !!(filters.type?.length || filters.priority?.length || filters.category?.length || filters.dateFrom || filters.dateTo);
  }, [filters]);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    // Data
    insights,
    stats,
    loading,
    error,
    total,
    
    // Pagination
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage,
    setLimit,
    
    // Sorting
    sortBy,
    sortOrder,
    updateSort,
    
    // Filters
    filters,
    hasFilters,
    updateFilters,
    clearFilters,
    
    // Actions
    applyInsight,
    dismissInsight,
    scheduleReminder,
    markAsRead,
    submitFeedback,
    exportInsights,
    generateInsights,
    reload: () => loadInsights(false),
    refresh: () => loadInsights(true)
  };
}
