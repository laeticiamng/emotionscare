/**
 * Music Session Service - Persistence Supabase
 * Sessions thérapeutiques avec vraie persistance DB
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { MusicSession } from '@/types/music';

/**
 * Créer une nouvelle session musicale
 */
export async function createMusicSession(
  session: Omit<MusicSession, 'id' | 'createdAt' | 'updatedAt'> & { notes?: string }
): Promise<MusicSession> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Fallback local si non authentifié
      return createLocalSession(session);
    }

    // Sauvegarder dans user_settings comme JSON
    const sessionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newSession: MusicSession = {
      id: sessionId,
      createdAt: now,
      updatedAt: now,
      ...session,
    };

    // Charger les sessions existantes
    const { data: existing } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', user.id)
      .eq('key', 'music:therapeutic-sessions')
      .maybeSingle();

    let sessions: MusicSession[] = [];
    if (existing?.value) {
      const parsed = typeof existing.value === 'string'
        ? JSON.parse(existing.value)
        : existing.value;
      sessions = Array.isArray(parsed) ? parsed : [];
    }

    // Ajouter la nouvelle session (garder 100 max)
    sessions = [newSession, ...sessions].slice(0, 100);

    // Sauvegarder
    await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        key: 'music:therapeutic-sessions',
        value: JSON.stringify(sessions),
        updated_at: now
      }, { onConflict: 'user_id,key' });

    logger.info('Session créée', { sessionId }, 'MUSIC');
    return newSession;
  } catch (error) {
    logger.error('Erreur création session', error as Error, 'MUSIC');
    return createLocalSession(session);
  }
}

/**
 * Mettre à jour une session existante
 */
export async function updateMusicSession(
  id: string,
  updates: Partial<MusicSession>
): Promise<MusicSession> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Charger les sessions
    const { data } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', user.id)
      .eq('key', 'music:therapeutic-sessions')
      .maybeSingle();

    if (!data?.value) {
      throw new Error('Session not found');
    }

    const parsed = typeof data.value === 'string'
      ? JSON.parse(data.value)
      : data.value;
    let sessions: MusicSession[] = Array.isArray(parsed) ? parsed : [];

    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Session not found');
    }

    const now = new Date().toISOString();
    const updated: MusicSession = {
      ...sessions[index],
      ...updates,
      updatedAt: now,
    };
    sessions[index] = updated;

    // Sauvegarder
    await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        key: 'music:therapeutic-sessions',
        value: JSON.stringify(sessions),
        updated_at: now
      }, { onConflict: 'user_id,key' });

    logger.info('Session mise à jour', { id }, 'MUSIC');
    return updated;
  } catch (error) {
    logger.error('Erreur mise à jour session', error as Error, 'MUSIC');
    throw error;
  }
}

/**
 * Récupérer les sessions d'un utilisateur
 */
export async function getUserMusicSessions(userId?: string): Promise<MusicSession[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', targetUserId)
      .eq('key', 'music:therapeutic-sessions')
      .maybeSingle();

    if (error) throw error;

    if (!data?.value) {
      return [];
    }

    const parsed = typeof data.value === 'string'
      ? JSON.parse(data.value)
      : data.value;

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    logger.error('Erreur chargement sessions', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Supprimer une session
 */
export async function deleteMusicSession(id: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', user.id)
      .eq('key', 'music:therapeutic-sessions')
      .maybeSingle();

    if (!data?.value) {
      return false;
    }

    const parsed = typeof data.value === 'string'
      ? JSON.parse(data.value)
      : data.value;
    let sessions: MusicSession[] = Array.isArray(parsed) ? parsed : [];

    const newSessions = sessions.filter(s => s.id !== id);

    if (newSessions.length === sessions.length) {
      return false;
    }

    await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        key: 'music:therapeutic-sessions',
        value: JSON.stringify(newSessions),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,key' });

    return true;
  } catch (error) {
    logger.error('Erreur suppression session', error as Error, 'MUSIC');
    return false;
  }
}

/**
 * Obtenir les statistiques de session
 */
export async function getSessionStats(): Promise<{
  totalSessions: number;
  totalDuration: number;
  avgDuration: number;
  topMood: string;
  streakDays: number;
}> {
  try {
    const sessions = await getUserMusicSessions();

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        avgDuration: 0,
        topMood: 'calm',
        streakDays: 0,
      };
    }

    const totalDuration = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);

    // Calculer le mood le plus fréquent
    const moodCounts: Record<string, number> = {};
    sessions.forEach(s => {
      if (s.mood) {
        moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1;
      }
    });
    const topMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'calm';

    // Calculer la streak
    let streakDays = 0;
    const today = new Date();
    const sessionDates = new Set(
      sessions.map(s => new Date(s.createdAt).toISOString().split('T')[0])
    );

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (sessionDates.has(dateStr)) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      totalSessions: sessions.length,
      totalDuration,
      avgDuration: Math.round(totalDuration / sessions.length),
      topMood,
      streakDays,
    };
  } catch (error) {
    logger.error('Erreur stats sessions', error as Error, 'MUSIC');
    return {
      totalSessions: 0,
      totalDuration: 0,
      avgDuration: 0,
      topMood: 'calm',
      streakDays: 0,
    };
  }
}

// Helpers

function createLocalSession(
  session: Omit<MusicSession, 'id' | 'createdAt' | 'updatedAt'>
): MusicSession {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...session,
  };
}
