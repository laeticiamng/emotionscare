/**
 * Hook pour gérer les sessions de musicothérapie premium
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface TherapyTrack {
  id: string;
  title: string;
  artist: string;
  duration_seconds: number;
  category: 'focus' | 'relaxation' | 'energy' | 'healing' | 'meditation' | 'sleep';
  frequency: string | null;
  description: string | null;
  audio_url: string | null;
  cover_url: string | null;
  is_premium: boolean;
  binaural_hz: number | null;
  tags: string[] | null;
  play_count: number;
}

export interface TherapySession {
  id: string;
  track_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  completion_rate: number | null;
  mood_before: number | null;
  mood_after: number | null;
  notes: string | null;
}

export interface TherapyStats {
  totalSessions: number;
  totalMinutes: number;
  averageMoodImprovement: number;
  favoriteCategory: string | null;
  currentStreak: number;
  weeklyGoalProgress: number;
}

export function useMusicTherapyPremium() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tracks, setTracks] = useState<TherapyTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<TherapyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<TherapySession | null>(null);
  const [stats, setStats] = useState<TherapyStats>({
    totalSessions: 0,
    totalMinutes: 0,
    averageMoodImprovement: 0,
    favoriteCategory: null,
    currentStreak: 0,
    weeklyGoalProgress: 0
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all tracks
  const fetchTracks = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('music_therapy_tracks')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setTracks((data || []) as TherapyTrack[]);
    } catch (error) {
      logger.error('Failed to fetch therapy tracks', error as Error, 'MUSIC_THERAPY');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user stats
  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) throw error;

      const sessions = (data || []) as TherapySession[];
      
      // Calculate stats
      const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;
      const moodImprovements = sessions
        .filter(s => s.mood_before && s.mood_after)
        .map(s => (s.mood_after! - s.mood_before!));
      const avgMoodImprovement = moodImprovements.length > 0 
        ? moodImprovements.reduce((a, b) => a + b, 0) / moodImprovements.length 
        : 0;

      // Calculate streak
      const today = new Date().toISOString().split('T')[0];
      let streak = 0;
      let checkDate = new Date();
      
      for (let i = 0; i < 30; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const hasSession = sessions.some(s => s.started_at.split('T')[0] === dateStr);
        if (hasSession) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (i > 0) {
          break;
        } else {
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }

      setStats({
        totalSessions: sessions.length,
        totalMinutes: Math.round(totalMinutes),
        averageMoodImprovement: Math.round(avgMoodImprovement * 10) / 10,
        favoriteCategory: null, // Would need track data to calculate
        currentStreak: streak,
        weeklyGoalProgress: Math.min(100, (sessions.filter(s => {
          const sessionDate = new Date(s.started_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return sessionDate > weekAgo;
        }).length / 5) * 100)
      });
    } catch (error) {
      logger.error('Failed to fetch therapy stats', error as Error, 'MUSIC_THERAPY');
    }
  }, [user]);

  // Start a session
  const startSession = useCallback(async (track: TherapyTrack, moodBefore?: number) => {
    if (!user) {
      toast({ 
        title: 'Connexion requise', 
        description: 'Connectez-vous pour suivre vos sessions.',
        variant: 'destructive' 
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_therapy_sessions')
        .insert({
          user_id: user.id,
          track_id: track.id,
          mood_before: moodBefore
        })
        .select()
        .single();

      if (error) throw error;

      setActiveSession(data as TherapySession);
      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= track.duration_seconds) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      toast({ title: '🎵 Session démarrée', description: track.title });
    } catch (error) {
      logger.error('Failed to start therapy session', error as Error, 'MUSIC_THERAPY');
    }
  }, [user, toast]);

  // End a session
  const endSession = useCallback(async (moodAfter?: number, notes?: string) => {
    if (!activeSession || !user) return;

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      const completionRate = currentTrack 
        ? Math.round((currentTime / currentTrack.duration_seconds) * 100)
        : 0;

      const { error } = await supabase
        .from('user_therapy_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: currentTime,
          completion_rate: completionRate,
          mood_after: moodAfter,
          notes
        })
        .eq('id', activeSession.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setActiveSession(null);
      setIsPlaying(false);
      
      if (completionRate >= 80) {
        toast({ 
          title: '✨ Session terminée !', 
          description: `Bravo ! Vous avez complété ${completionRate}% de la session.` 
        });
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      logger.error('Failed to end therapy session', error as Error, 'MUSIC_THERAPY');
    }
  }, [activeSession, user, currentTime, currentTrack, toast, fetchStats]);

  // Playback controls
  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;

    if (isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration_seconds) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrack]);

  const seek = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, currentTrack?.duration_seconds || 0)));
  }, [currentTrack]);

  // Filter tracks by category
  const getTracksByCategory = useCallback((category: TherapyTrack['category']) => {
    return tracks.filter(t => t.category === category);
  }, [tracks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTracks();
    if (user) {
      fetchStats();
    }
  }, [fetchTracks, fetchStats, user]);

  return {
    // Tracks
    tracks,
    isLoading,
    fetchTracks,
    getTracksByCategory,
    
    // Current playback
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    setVolume,
    
    // Controls
    startSession,
    endSession,
    togglePlayPause,
    seek,
    
    // Session
    activeSession,
    
    // Stats
    stats
  };
}
