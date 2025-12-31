/**
 * Hook pour récupérer les statistiques VR de l'utilisateur
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { VRNebulaStats } from '@/modules/vr-nebula/types';

export interface VRSessionSummary {
  id: string;
  scene: string;
  breathing_pattern: string;
  duration_s: number;
  coherence_score: number | null;
  rmssd_delta: number | null;
  cycles_completed: number;
  created_at: string;
}

async function fetchVRStats(): Promise<VRNebulaStats> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: sessions, error } = await supabase
    .from('vr_nebula_sessions')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;

  const safeData = sessions || [];
  
  const total_sessions = safeData.length;
  const total_minutes = Math.round(safeData.reduce((sum, s) => sum + (s.duration_s || 0), 0) / 60);
  const total_breaths = safeData.reduce((sum, s) => sum + (s.cycles_completed || 0), 0);

  const withCoherence = safeData.filter(s => s.coherence_score !== null);
  const average_coherence = withCoherence.length > 0
    ? Math.round(withCoherence.reduce((sum, s) => sum + (s.coherence_score || 0), 0) / withCoherence.length)
    : 0;

  const withHRV = safeData.filter(s => s.rmssd_delta !== null);
  const average_hrv_gain = withHRV.length > 0
    ? Math.round(withHRV.reduce((sum, s) => sum + (s.rmssd_delta || 0), 0) / withHRV.length * 10) / 10
    : 0;

  // Scene préférée
  const sceneCounts: Record<string, number> = {};
  safeData.forEach(s => {
    if (s.scene) sceneCounts[s.scene] = (sceneCounts[s.scene] || 0) + 1;
  });
  const favorite_scene = Object.keys(sceneCounts).length > 0
    ? Object.entries(sceneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as any
    : null;

  // Pattern préféré
  const patternCounts: Record<string, number> = {};
  safeData.forEach(s => {
    if (s.breathing_pattern) patternCounts[s.breathing_pattern] = (patternCounts[s.breathing_pattern] || 0) + 1;
  });
  const favorite_pattern = Object.keys(patternCounts).length > 0
    ? Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as any
    : null;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const sessions_this_week = safeData.filter(s => new Date(s.created_at) >= weekAgo).length;
  const sessions_this_month = safeData.filter(s => new Date(s.created_at) >= monthAgo).length;

  const longest_session_minutes = safeData.length > 0
    ? Math.round(Math.max(...safeData.map(s => (s.duration_s || 0) / 60)))
    : 0;

  // Streak
  const dates = safeData
    .map(s => new Date(s.created_at).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const uniqueDates = Array.from(new Set(dates));
  
  let current_streak_days = 0;
  const today = new Date().toDateString();
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i]);
    if (i === 0 && uniqueDates[0] !== today) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      if (uniqueDates[0] !== yesterday) break;
    }
    
    if (i > 0) {
      const prev = new Date(uniqueDates[i - 1]);
      const diffDays = Math.floor((prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays !== 1) break;
    }
    current_streak_days++;
  }

  return {
    total_sessions,
    total_minutes,
    total_breaths,
    average_coherence,
    average_hrv_gain,
    favorite_scene,
    favorite_pattern,
    sessions_this_week,
    sessions_this_month,
    longest_session_minutes,
    current_streak_days,
  };
}

export function useVRStats() {
  return useQuery({
    queryKey: ['vr-stats'],
    queryFn: fetchVRStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

async function fetchVRHistory(limit = 20): Promise<VRSessionSummary[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('vr_nebula_sessions')
    .select('id, scene, breathing_pattern, duration_s, coherence_score, rmssd_delta, cycles_completed, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching VR history:', error);
    return [];
  }

  return (data || []) as VRSessionSummary[];
}

export function useVRHistory(limit = 20) {
  return useQuery({
    queryKey: ['vr-history', limit],
    queryFn: () => fetchVRHistory(limit),
    staleTime: 2 * 60 * 1000,
  });
}

async function fetchWeeklyProgress(): Promise<{ day: string; minutes: number }[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const { data, error } = await supabase
    .from('vr_nebula_sessions')
    .select('duration_s, created_at')
    .eq('user_id', user.id)
    .gte('created_at', weekAgo.toISOString());

  if (error) return [];

  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const dayMinutes: Record<string, number> = {};
  
  // Initialize all days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dayName = days[date.getDay()];
    dayMinutes[dayName] = 0;
  }

  (data || []).forEach(s => {
    const date = new Date(s.created_at);
    const dayName = days[date.getDay()];
    dayMinutes[dayName] = (dayMinutes[dayName] || 0) + Math.round((s.duration_s || 0) / 60);
  });

  return Object.entries(dayMinutes).map(([day, minutes]) => ({ day, minutes }));
}

export function useVRWeeklyProgress() {
  return useQuery({
    queryKey: ['vr-weekly-progress'],
    queryFn: fetchWeeklyProgress,
    staleTime: 5 * 60 * 1000,
  });
}
