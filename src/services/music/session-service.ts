// @ts-nocheck
import { MusicSession } from '@/types/music';

export async function createMusicSession(session: Omit<MusicSession, 'id' | 'createdAt' | 'updatedAt'> & { notes?: string }): Promise<MusicSession> {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('music_sessions')
    .insert({
      user_id: user?.id || session.userId,
      mood: session.mood,
      duration: session.duration,
      track_count: session.trackCount,
      genre: session.genre,
      notes: session.notes,
      started_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    mood: data.mood,
    duration: data.duration || 0,
    trackCount: data.track_count || 0,
    genre: data.genre,
    createdAt: data.started_at
  };
}

export async function updateMusicSession(id: string, updates: Partial<MusicSession>): Promise<MusicSession> {
  const { supabase } = await import('@/integrations/supabase/client');

  const { data, error } = await supabase
    .from('music_sessions')
    .update({
      mood: updates.mood,
      duration: updates.duration,
      track_count: updates.trackCount,
      genre: updates.genre,
      ended_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    mood: data.mood,
    duration: data.duration || 0,
    trackCount: data.track_count || 0,
    genre: data.genre,
    createdAt: data.started_at,
    updatedAt: data.ended_at
  };
}

export async function getUserMusicSessions(userId: string): Promise<MusicSession[]> {
  const { supabase } = await import('@/integrations/supabase/client');

  const { data, error } = await supabase
    .from('music_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data || []).map(s => ({
    id: s.id,
    userId: s.user_id,
    mood: s.mood,
    duration: s.duration || 0,
    trackCount: s.track_count || 0,
    genre: s.genre,
    createdAt: s.started_at
  }));
}
