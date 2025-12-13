// @ts-nocheck
import { MusicSession } from '@/types/music';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Statistiques de session */
export interface SessionStats {
  totalSessions: number;
  totalDuration: number;
  averageDuration: number;
  completionRate: number;
  moodImprovement: number;
}

/** Filtre de session */
export interface SessionFilter {
  startDate?: Date;
  endDate?: Date;
  minDuration?: number;
  mood?: string;
  completed?: boolean;
}

/** Crée une nouvelle session musicale */
export async function createMusicSession(
  session: Omit<MusicSession, 'id' | 'createdAt' | 'updatedAt'> & { notes?: string }
): Promise<MusicSession> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    const { data, error } = await supabase
      .from('music_sessions')
      .insert({
        user_id: userId,
        ...session,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Music session created', { id: data.id }, 'MUSIC');
    return data as MusicSession;
  } catch (error) {
    logger.error('Error creating session', error as Error, 'MUSIC');
    throw error;
  }
}

/** Met à jour une session existante */
export async function updateMusicSession(
  id: string,
  updates: Partial<MusicSession>
): Promise<MusicSession> {
  try {
    const { data, error } = await supabase
      .from('music_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logger.info('Music session updated', { id }, 'MUSIC');
    return data as MusicSession;
  } catch (error) {
    logger.error('Error updating session', error as Error, 'MUSIC');
    throw error;
  }
}

/** Récupère les sessions d'un utilisateur */
export async function getUserMusicSessions(
  userId: string,
  filter?: SessionFilter
): Promise<MusicSession[]> {
  try {
    let query = supabase
      .from('music_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filter?.startDate) {
      query = query.gte('created_at', filter.startDate.toISOString());
    }
    if (filter?.endDate) {
      query = query.lte('created_at', filter.endDate.toISOString());
    }
    if (filter?.minDuration) {
      query = query.gte('duration', filter.minDuration);
    }
    if (filter?.completed !== undefined) {
      query = query.eq('completed', filter.completed);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []) as MusicSession[];
  } catch (error) {
    logger.error('Error fetching sessions', error as Error, 'MUSIC');
    return [];
  }
}

/** Récupère une session par ID */
export async function getSessionById(id: string): Promise<MusicSession | null> {
  try {
    const { data, error } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as MusicSession;
  } catch (error) {
    return null;
  }
}

/** Supprime une session */
export async function deleteSession(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('music_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    logger.info('Session deleted', { id }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Error deleting session', error as Error, 'MUSIC');
    return false;
  }
}

/** Termine une session */
export async function completeSession(
  id: string,
  moodAfter?: string,
  notes?: string
): Promise<MusicSession> {
  return updateMusicSession(id, {
    completed: true,
    moodAfter,
    notes,
    endTime: new Date().toISOString()
  } as Partial<MusicSession>);
}

/** Récupère les statistiques de session */
export async function getSessionStats(userId: string): Promise<SessionStats> {
  try {
    const sessions = await getUserMusicSessions(userId);

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageDuration: 0,
        completionRate: 0,
        moodImprovement: 0
      };
    }

    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const completed = sessions.filter(s => s.completed).length;

    return {
      totalSessions: sessions.length,
      totalDuration,
      averageDuration: totalDuration / sessions.length,
      completionRate: (completed / sessions.length) * 100,
      moodImprovement: calculateMoodImprovement(sessions)
    };
  } catch (error) {
    return {
      totalSessions: 0,
      totalDuration: 0,
      averageDuration: 0,
      completionRate: 0,
      moodImprovement: 0
    };
  }
}

/** Récupère les sessions récentes */
export async function getRecentSessions(limit = 10): Promise<MusicSession[]> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return [];

    const { data } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    return (data || []) as MusicSession[];
  } catch (error) {
    return [];
  }
}

/** Récupère la session active */
export async function getActiveSession(): Promise<MusicSession | null> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return null;

    const { data } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return data as MusicSession | null;
  } catch (error) {
    return null;
  }
}

/** Calcule l'amélioration d'humeur moyenne */
function calculateMoodImprovement(sessions: MusicSession[]): number {
  const moodValues: Record<string, number> = {
    'very_bad': 1, 'bad': 2, 'neutral': 3, 'good': 4, 'very_good': 5
  };

  let totalImprovement = 0;
  let count = 0;

  for (const session of sessions) {
    if (session.moodBefore && session.moodAfter) {
      const before = moodValues[session.moodBefore] || 3;
      const after = moodValues[session.moodAfter] || 3;
      totalImprovement += after - before;
      count++;
    }
  }

  return count > 0 ? (totalImprovement / count) * 20 : 0;
}
