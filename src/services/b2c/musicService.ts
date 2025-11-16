// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface MusicPreset {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  engine: 'suno' | 'musicgen' | 'other';
  cfg_json: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface MusicSession {
  id: string;
  user_id: string;
  preset_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  duration_sec?: number;
  ts_start: string;
  ts_end?: string;
  artifact_url?: string;
  metadata: Record<string, any>;
}

export interface CreateMusicSessionInput {
  preset_id: string;
  metadata?: Record<string, any>;
}

export const musicService = {
  /**
   * Récupérer tous les presets actifs
   */
  async getActivePresets(): Promise<MusicPreset[]> {
    const { data, error } = await supabase
      .from('session_presets')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data as MusicPreset[];
  },

  /**
   * Créer une nouvelle session musicale
   */
  async createMusicSession(input: CreateMusicSessionInput): Promise<MusicSession> {
    const { data, error } = await supabase
      .from('music_sessions')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        preset_id: input.preset_id,
        status: 'pending',
        metadata: input.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;

    // Déclencher le traitement via Edge Function
    try {
      await supabase.functions.invoke('process-music-session', {
        body: {
          sessionId: data.id,
          presetId: input.preset_id,
          metadata: input.metadata || {}
        }
      });
    } catch (edgeFunctionError) {
      // Log l'erreur mais ne pas échouer la création de session
      logger.error('Edge Function invocation failed:', edgeFunctionError, 'SERVICE');
      // La session est créée, le traitement se fera en arrière-plan
    }

    return data as MusicSession;
  },

  /**
   * Récupérer une session musicale par ID
   */
  async getMusicSession(id: string): Promise<MusicSession | null> {
    const { data, error } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data as MusicSession;
  },

  /**
   * Récupérer les sessions musicales d'un utilisateur
   */
  async getUserMusicSessions(limit: number = 20): Promise<MusicSession[]> {
    const { data, error } = await supabase
      .from('music_sessions')
      .select('*')
      .order('ts_start', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as MusicSession[];
  },

  /**
   * Mettre à jour le statut d'une session (utilisé par l'Edge Function)
   */
  async updateSessionStatus(
    id: string,
    status: MusicSession['status'],
    artifact_url?: string,
    duration_sec?: number
  ): Promise<void> {
    const updates: Partial<MusicSession> = { status };
    
    if (status === 'completed') {
      updates.ts_end = new Date().toISOString();
      updates.artifact_url = artifact_url;
      updates.duration_sec = duration_sec;
    }

    const { error } = await supabase
      .from('music_sessions')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },
};
