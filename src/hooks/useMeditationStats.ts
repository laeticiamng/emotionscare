/**
 * Hook pour récupérer les statistiques et sessions de méditation
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MeditationSessionSummary {
  id: string;
  technique: string;
  duration: number;
  completed_duration: number;
  completed: boolean;
  mood_before: number | null;
  mood_after: number | null;
  mood_delta: number | null;
  with_guidance: boolean;
  with_music: boolean;
  created_at: string;
  completed_at: string | null;
}

export interface MeditationStatsData {
  total_sessions: number;
  completed_sessions: number;
  total_minutes: number;
  average_duration_minutes: number;
  favorite_technique: string | null;
  completion_rate: number;
  current_streak: number;
  longest_streak: number;
  avg_mood_delta: number | null;
  sessions_this_week: number;
  sessions_this_month: number;
  longest_session_minutes: number;
}

async function fetchMeditationStats(): Promise<MeditationStatsData> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: sessions, error } = await supabase
    .from('meditation_sessions')
    .select('id, technique, duration, completed_duration, completed, mood_before, mood_after, mood_delta, with_guidance, with_music, created_at, completed_at')
    .eq('user_id', user.id);

  if (error) throw error;

  const allSessions = (sessions || []) as MeditationSessionSummary[];
  const completedSessions = allSessions.filter(s => s.completed);
  
  const total_sessions = allSessions.length;
  const completed_sessions_count = completedSessions.length;
  
  const total_minutes = Math.round(
    completedSessions.reduce((sum, s) => sum + (s.completed_duration || 0), 0) / 60
  );
  
  const average_duration_minutes = completed_sessions_count > 0
    ? Math.round(total_minutes / completed_sessions_count)
    : 0;

  // Technique favorite
  const techniqueCounts: Record<string, number> = {};
  completedSessions.forEach(s => {
    if (s.technique) techniqueCounts[s.technique] = (techniqueCounts[s.technique] || 0) + 1;
  });
  const favorite_technique = Object.keys(techniqueCounts).length > 0
    ? Object.entries(techniqueCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null
    : null;

  // Taux de complétion
  const completion_rate = total_sessions > 0
    ? Math.round((completed_sessions_count / total_sessions) * 100)
    : 0;

  // Mood delta moyen
  const moodDeltas = completedSessions
    .filter(s => s.mood_delta !== null)
    .map(s => s.mood_delta as number);
  const avg_mood_delta = moodDeltas.length > 0
    ? Math.round(moodDeltas.reduce((sum, d) => sum + d, 0) / moodDeltas.length * 10) / 10
    : null;

  // Calcul des streaks
  const sessionDates = completedSessions
    .map(s => new Date(s.completed_at || s.created_at).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const uniqueDates = Array.from(new Set(sessionDates));
  
  let current_streak = 0;
  let longest_streak = 0;
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
      if (diffDays !== 1) {
        if (current_streak > longest_streak) longest_streak = current_streak;
        break;
      }
    }
    current_streak++;
  }
  if (current_streak > longest_streak) longest_streak = current_streak;

  // Sessions par période
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const sessions_this_week = completedSessions.filter(
    s => new Date(s.created_at) >= weekAgo
  ).length;
  const sessions_this_month = completedSessions.filter(
    s => new Date(s.created_at) >= monthAgo
  ).length;

  const longest_session_minutes = completedSessions.length > 0
    ? Math.round(Math.max(...completedSessions.map(s => (s.completed_duration || 0) / 60)))
    : 0;

  return {
    total_sessions,
    completed_sessions: completed_sessions_count,
    total_minutes,
    average_duration_minutes,
    favorite_technique,
    completion_rate,
    current_streak,
    longest_streak,
    avg_mood_delta,
    sessions_this_week,
    sessions_this_month,
    longest_session_minutes,
  };
}

export function useMeditationStats() {
  return useQuery({
    queryKey: ['meditation-stats'],
    queryFn: fetchMeditationStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

async function fetchMeditationHistory(limit = 20): Promise<MeditationSessionSummary[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('id, technique, duration, completed_duration, completed, mood_before, mood_after, mood_delta, with_guidance, with_music, created_at, completed_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching meditation history:', error);
    return [];
  }

  return (data || []) as MeditationSessionSummary[];
}

export function useMeditationHistory(limit = 20) {
  return useQuery({
    queryKey: ['meditation-history', limit],
    queryFn: () => fetchMeditationHistory(limit),
    staleTime: 2 * 60 * 1000,
  });
}

async function fetchWeeklyProgress(): Promise<{ day: string; minutes: number }[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('completed_duration, created_at')
    .eq('user_id', user.id)
    .eq('completed', true)
    .gte('created_at', weekAgo.toISOString());

  if (error) return [];

  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const dayMinutes: Record<string, number> = {};
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dayName = days[date.getDay()];
    dayMinutes[dayName] = 0;
  }

  (data || []).forEach((s: any) => {
    const date = new Date(s.created_at);
    const dayName = days[date.getDay()];
    dayMinutes[dayName] = (dayMinutes[dayName] || 0) + Math.round((s.completed_duration || 0) / 60);
  });

  return Object.entries(dayMinutes).map(([day, minutes]) => ({ day, minutes }));
}

export function useMeditationWeeklyProgress() {
  return useQuery({
    queryKey: ['meditation-weekly-progress'],
    queryFn: fetchWeeklyProgress,
    staleTime: 5 * 60 * 1000,
  });
}
