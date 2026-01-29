/**
 * useARFilterAnalytics - Hook pour tracker l'utilisation des filtres AR
 * Corrige: AR Filters adoption nulle
 */

import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface ARFilterSession {
  id: string;
  user_id: string;
  filter_type: string;
  duration_seconds: number;
  photos_taken: number;
  mood_impact?: string;
  created_at: string;
  completed_at?: string;
}

export function useARFilterAnalytics() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const activeSessionRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const photosCountRef = useRef<number>(0);

  // Start AR filter session
  const startSession = useCallback(async (
    filterType: string
  ): Promise<string | null> => {
    if (!isAuthenticated || !user?.id) {
      logger.warn('Cannot start AR session: not authenticated', 'AR');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('ar_filter_sessions')
        .insert({
          user_id: user.id,
          filter_type: filterType,
          created_at: new Date().toISOString(),
          photos_taken: 0,
        })
        .select('id')
        .single();

      if (error) throw error;

      activeSessionRef.current = data.id;
      startTimeRef.current = Date.now();
      photosCountRef.current = 0;

      logger.info(`Started AR session: ${data.id} (${filterType})`, 'AR');
      return data.id;
    } catch (err) {
      logger.error(`Failed to start AR session: ${err}`, 'AR');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  // Record photo taken
  const recordPhoto = useCallback(() => {
    photosCountRef.current += 1;
  }, []);

  // Complete AR session
  const completeSession = useCallback(async (
    sessionId: string,
    moodImpact?: 'positive' | 'neutral' | 'negative'
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false;

    try {
      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

      const { error } = await supabase
        .from('ar_filter_sessions')
        .update({
          completed_at: new Date().toISOString(),
          duration_seconds: durationSeconds,
          photos_taken: photosCountRef.current,
          mood_impact: moodImpact,
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      activeSessionRef.current = null;

      toast({
        title: '📸 Session AR terminée',
        description: `${photosCountRef.current} photo(s) prise(s)`,
      });

      logger.info(`Completed AR session: ${sessionId}`, 'AR');
      return true;
    } catch (err) {
      logger.error(`Failed to complete AR session: ${err}`, 'AR');
      return false;
    }
  }, [isAuthenticated, user?.id, toast]);

  // Record quick AR usage
  const recordUsage = useCallback(async (
    filterType: string,
    durationSeconds: number,
    photosTaken = 0,
    moodImpact?: 'positive' | 'neutral' | 'negative'
  ): Promise<string | null> => {
    if (!isAuthenticated || !user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('ar_filter_sessions')
        .insert({
          user_id: user.id,
          filter_type: filterType,
          created_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
          completed_at: new Date().toISOString(),
          duration_seconds: durationSeconds,
          photos_taken: photosTaken,
          mood_impact: moodImpact,
        })
        .select('id')
        .single();

      if (error) throw error;

      logger.info(`Recorded AR usage: ${data.id}`, 'AR');
      return data.id;
    } catch (err) {
      logger.error(`Failed to record AR usage: ${err}`, 'AR');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  // Get AR usage stats
  const getStats = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return null;

    try {
      const { data } = await supabase
        .from('ar_filter_sessions')
        .select('filter_type, duration_seconds, photos_taken, mood_impact')
        .eq('user_id', user.id);

      const sessions = data || [];
      if (sessions.length === 0) return null;

      const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;
      const totalPhotos = sessions.reduce((sum, s) => sum + (s.photos_taken || 0), 0);

      // Count filter usage
      const filterCounts: Record<string, number> = {};
      sessions.forEach(s => {
        filterCounts[s.filter_type] = (filterCounts[s.filter_type] || 0) + 1;
      });

      const mostUsedFilter = Object.entries(filterCounts)
        .sort((a, b) => b[1] - a[1])[0];

      // Count mood impacts
      const positiveImpact = sessions.filter(s => s.mood_impact === 'positive').length;

      return {
        totalSessions: sessions.length,
        totalMinutes: Math.round(totalMinutes),
        totalPhotos,
        mostUsedFilter: mostUsedFilter?.[0] || null,
        positiveImpactRate: Math.round((positiveImpact / sessions.length) * 100),
      };
    } catch (err) {
      logger.error(`Failed to fetch AR stats: ${err}`, 'AR');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  // Get AR history
  const getHistory = useCallback(async (limit = 20): Promise<ARFilterSession[]> => {
    if (!isAuthenticated || !user?.id) return [];

    try {
      const { data } = await supabase
        .from('ar_filter_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      return data || [];
    } catch (err) {
      logger.error(`Failed to fetch AR history: ${err}`, 'AR');
      return [];
    }
  }, [isAuthenticated, user?.id]);

  return {
    activeSessionId: activeSessionRef.current,
    photosCount: photosCountRef.current,
    startSession,
    recordPhoto,
    completeSession,
    recordUsage,
    getStats,
    getHistory,
  };
}

export default useARFilterAnalytics;
