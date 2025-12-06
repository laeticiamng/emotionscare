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

  /**
   * Polling pour vérifier le statut d'une session en cours
   * Retourne la session quand elle est completed ou failed
   */
  async pollSessionStatus(
    sessionId: string,
    options: {
      maxAttempts?: number;
      intervalMs?: number;
      onProgress?: (attempt: number) => void;
    } = {}
  ): Promise<MusicSession> {
    const maxAttempts = options.maxAttempts || 30; // 30 tentatives par défaut
    const intervalMs = options.intervalMs || 10000; // 10 secondes par défaut

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      options.onProgress?.(attempt);

      const session = await this.getMusicSession(sessionId);

      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      // Statuts terminaux
      if (session.status === 'completed') {
        logger.info('Music session completed', { sessionId }, 'musicService.pollSessionStatus');
        return session;
      }

      if (session.status === 'failed') {
        logger.error('Music session failed', { sessionId }, 'musicService.pollSessionStatus');
        throw new Error('Music generation failed');
      }

      // Si pas encore terminé, attendre
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }

    throw new Error('Music generation timeout - exceeded maximum polling attempts');
  },

  /**
   * Subscribe to music session updates via Supabase Realtime
   */
  subscribeToSession(
    sessionId: string,
    callback: (session: MusicSession) => void
  ) {
    const channel = supabase
      .channel(`music_session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'music_sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          callback(payload.new as MusicSession);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
