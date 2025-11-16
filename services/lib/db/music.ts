/**
 * Database service for Music Generation
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  MusicGenerationSession,
  CreateMusicGenerationInput,
  ListMusicSessionsInput,
} from '@emotionscare/contracts';

/**
 * List music generation sessions for a user
 */
export async function listMusicSessions(
  userId: string,
  filters: ListMusicSessionsInput
) {
  try {
    let query = supabase
      .from('music_generation_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order(filters.sortBy, { ascending: filters.sortOrder === 'asc' })
      .range(filters.offset, filters.offset + filters.limit - 1);

    // Apply status filter if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error, count } = await query;

    if (error) {
      logger.error(error, 'DB');
      throw new Error(`Failed to list music sessions: ${error.message}`);
    }

    return {
      sessions: data as MusicGenerationSession[],
      total: count || 0,
      hasMore: (count || 0) > filters.offset + filters.limit,
    };
  } catch (error) {
    logger.error(error as Error, 'DB');
    throw error;
  }
}

/**
 * Create a new music generation session
 */
export async function createMusicSession(
  userId: string,
  input: CreateMusicGenerationInput
): Promise<MusicGenerationSession> {
  try {
    const session = {
      user_id: userId,
      task_id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      emotion_state: input.emotionState,
      emotion_badge: input.emotionBadge,
      suno_config: input.config,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('music_generation_sessions')
      .insert(session)
      .select()
      .single();

    if (error) {
      logger.error(error, 'DB');
      throw new Error(`Failed to create music session: ${error.message}`);
    }

    return data as MusicGenerationSession;
  } catch (error) {
    logger.error(error as Error, 'DB');
    throw error;
  }
}

/**
 * Get a specific music generation session
 */
export async function getMusicSession(
  sessionId: string,
  userId: string
): Promise<MusicGenerationSession | null> {
  try {
    const { data, error } = await supabase
      .from('music_generation_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      logger.error(error, 'DB');
      throw new Error(`Failed to get music session: ${error.message}`);
    }

    return data as MusicGenerationSession;
  } catch (error) {
    logger.error(error as Error, 'DB');
    throw error;
  }
}

/**
 * Update music session status and result
 */
export async function updateMusicSession(
  sessionId: string,
  userId: string,
  updates: Partial<MusicGenerationSession>
): Promise<MusicGenerationSession> {
  try {
    const { data, error } = await supabase
      .from('music_generation_sessions')
      .update(updates)
      .eq('id', sessionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error(error, 'DB');
      throw new Error(`Failed to update music session: ${error.message}`);
    }

    return data as MusicGenerationSession;
  } catch (error) {
    logger.error(error as Error, 'DB');
    throw error;
  }
}

/**
 * Delete a music generation session
 */
export async function deleteMusicSession(
  sessionId: string,
  userId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('music_generation_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) {
      logger.error(error, 'DB');
      throw new Error(`Failed to delete music session: ${error.message}`);
    }
  } catch (error) {
    logger.error(error as Error, 'DB');
    throw error;
  }
}
