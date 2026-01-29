/**
 * useVRSessionTracking - Hook pour tracker les sessions VR
 * Corrige: Sessions VR non trackées
 */

import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface VRSession {
  id: string;
  user_id: string;
  experience_type: 'nebula' | 'dome' | 'galaxy' | 'breath' | 'relaxation';
  duration_seconds: number;
  device_type?: string;
  comfort_level?: number;
  immersion_score?: number;
  mood_before?: number;
  mood_after?: number;
  started_at: string;
  completed_at?: string;
}

export function useVRSessionTracking() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const activeSessionRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);

  // Start VR session
  const startSession = useCallback(async (
    experienceType: VRSession['experience_type'],
    deviceType?: string,
    moodBefore?: number
  ): Promise<string | null> => {
    if (!isAuthenticated || !user?.id) {
      logger.warn('Cannot start VR session: not authenticated', 'VR');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('vr_dome_sessions')
        .insert({
          user_id: user.id,
          experience_id: experienceType,
          started_at: new Date().toISOString(),
          completed: false,
          metadata: { device_type: deviceType, mood_before: moodBefore },
        })
        .select('id')
        .single();

      if (error) throw error;

      activeSessionRef.current = data.id;
      startTimeRef.current = Date.now();
      logger.info(`Started VR session: ${data.id} (${experienceType})`, 'VR');
      return data.id;
    } catch (err) {
      logger.error(`Failed to start VR session: ${err}`, 'VR');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  // Complete VR session
  const completeSession = useCallback(async (
    sessionId: string,
    options?: {
      comfortLevel?: number;
      immersionScore?: number;
      moodAfter?: number;
    }
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false;

    try {
      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

      const { error } = await supabase
        .from('vr_dome_sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          duration_seconds: durationSeconds,
          comfort_level: options?.comfortLevel,
          immersion_score: options?.immersionScore,
          metadata: {
            mood_after: options?.moodAfter,
          },
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      activeSessionRef.current = null;
      startTimeRef.current = 0;

      toast({
        title: '🥽 Session VR terminée',
        description: `${Math.floor(durationSeconds / 60)} min d'immersion`,
      });

      logger.info(`Completed VR session: ${sessionId}`, 'VR');
      return true;
    } catch (err) {
      logger.error(`Failed to complete VR session: ${err}`, 'VR');
      return false;
    }
  }, [isAuthenticated, user?.id, toast]);

  // Record quick VR session
  const recordSession = useCallback(async (
    experienceType: VRSession['experience_type'],
    durationSeconds: number,
    options?: {
      deviceType?: string;
      comfortLevel?: number;
      immersionScore?: number;
      moodBefore?: number;
      moodAfter?: number;
    }
  ): Promise<string | null> => {
    if (!isAuthenticated || !user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('vr_dome_sessions')
        .insert({
          user_id: user.id,
          experience_id: experienceType,
          started_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
          completed_at: new Date().toISOString(),
          completed: true,
          duration_seconds: durationSeconds,
          comfort_level: options?.comfortLevel,
          immersion_score: options?.immersionScore,
          metadata: {
            device_type: options?.deviceType,
            mood_before: options?.moodBefore,
            mood_after: options?.moodAfter,
          },
        })
        .select('id')
        .single();

      if (error) throw error;

      logger.info(`Recorded VR session: ${data.id}`, 'VR');
      return data.id;
    } catch (err) {
      logger.error(`Failed to record VR session: ${err}`, 'VR');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  // Get VR history
  const getHistory = useCallback(async (limit = 20): Promise<VRSession[]> => {
    if (!isAuthenticated || !user?.id) return [];

    try {
      const { data } = await supabase
        .from('vr_dome_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(limit);

      return (data || []).map(s => ({
        id: s.id,
        user_id: s.user_id,
        experience_type: s.experience_id as VRSession['experience_type'],
        duration_seconds: s.duration_seconds || 0,
        device_type: (s.metadata as any)?.device_type,
        comfort_level: s.comfort_level,
        immersion_score: s.immersion_score,
        mood_before: (s.metadata as any)?.mood_before,
        mood_after: (s.metadata as any)?.mood_after,
        started_at: s.started_at,
        completed_at: s.completed_at,
      }));
    } catch (err) {
      logger.error(`Failed to fetch VR history: ${err}`, 'VR');
      return [];
    }
  }, [isAuthenticated, user?.id]);

  // Get VR stats
  const getStats = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return null;

    try {
      const { data } = await supabase
        .from('vr_dome_sessions')
        .select('duration_seconds, immersion_score, comfort_level')
        .eq('user_id', user.id)
        .eq('completed', true);

      const sessions = data || [];
      if (sessions.length === 0) return null;

      const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;
      const avgImmersion = sessions.reduce((sum, s) => sum + (s.immersion_score || 0), 0) / sessions.length;
      const avgComfort = sessions.reduce((sum, s) => sum + (s.comfort_level || 0), 0) / sessions.length;

      return {
        totalSessions: sessions.length,
        totalMinutes: Math.round(totalMinutes),
        averageImmersion: Math.round(avgImmersion * 10) / 10,
        averageComfort: Math.round(avgComfort * 10) / 10,
      };
    } catch (err) {
      logger.error(`Failed to fetch VR stats: ${err}`, 'VR');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  return {
    activeSessionId: activeSessionRef.current,
    startSession,
    completeSession,
    recordSession,
    getHistory,
    getStats,
  };
}

export default useVRSessionTracking;
