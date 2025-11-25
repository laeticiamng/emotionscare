/**
 * VR Experiences API Routes
 * Endpoints pour gérer les sessions VR (Nebula, Dome, Galaxy)
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { getSupabaseClient } from '../lib/supabase';

const vrProfileSchema = z.object({
  comfort: z.enum(['very_low', 'low', 'medium']).optional(),
  duration: z.enum(['short', 'normal']).optional(),
  locomotion: z.enum(['teleport', 'smooth']).optional(),
  fov: z.enum(['narrow', 'default']).optional(),
  audio: z.enum(['calm', 'soft']).optional(),
  guidance: z.enum(['long_exhale', 'none']).optional(),
  vignette: z.enum(['none', 'soft', 'comfort']).optional(),
  bloom: z.boolean().optional(),
  particles: z.enum(['low', 'medium', 'high']).optional(),
  fallback2dNext: z.boolean().optional(),
});

const createSessionSchema = z.object({
  experience_type: z.enum(['nebula', 'dome', 'galaxy', 'breath']),
  duration_seconds: z.number().int().min(1).max(7200),
  vr_tier: z.enum(['low', 'mid', 'high']).optional(),
  profile: vrProfileSchema.optional(),
  mood_before: z.number().min(1).max(10).optional().nullable(),
  mood_after: z.number().min(1).max(10).optional().nullable(),
  completed: z.boolean().optional(),
  session_data: z.record(z.unknown()).optional(),
});

const updateSessionSchema = z.object({
  duration_seconds: z.number().int().min(1).max(7200).optional(),
  mood_after: z.number().min(1).max(10).optional().nullable(),
  completed: z.boolean().optional(),
  session_data: z.record(z.unknown()).optional(),
});

type SessionRequest = FastifyRequest<{
  Body: z.infer<typeof createSessionSchema>;
}>;

type SessionUpdateRequest = FastifyRequest<{
  Params: { id: string };
  Body: z.infer<typeof updateSessionSchema>;
}>;

type SessionGetRequest = FastifyRequest<{
  Params: { id: string };
}>;

type SessionListRequest = FastifyRequest<{
  Querystring: {
    limit?: string;
    offset?: string;
    experience_type?: string;
  };
}>;

type SessionRecord = Record<string, unknown>;

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

export interface VRRepository {
  createSession: (userId: string, payload: CreateSessionInput) => Promise<SessionRecord>;
  listSessions: (userId: string, limit?: number, offset?: number, experienceType?: string) => Promise<SessionRecord[]>;
  getSession: (id: string, userId: string) => Promise<SessionRecord | null>;
  updateSession: (id: string, userId: string, payload: UpdateSessionInput) => Promise<SessionRecord | null>;
  deleteSession: (id: string, userId: string) => Promise<void>;
  getStats: (userId: string) => Promise<SessionRecord>;
  getExperiences: () => Promise<SessionRecord[]>;
  getEnvironments: () => Promise<SessionRecord[]>;
}

const createVRRepository = (): VRRepository => {
  const supabase = getSupabaseClient();

  return {
    async createSession(userId, payload) {
      // Map API fields to existing table columns
      const { data, error } = await supabase
        .from('vr_sessions')
        .insert({
          user_id: userId,
          experience_id: payload.experience_type,
          experience_title: payload.experience_type.charAt(0).toUpperCase() + payload.experience_type.slice(1),
          experience_type: payload.experience_type,
          duration_minutes: Math.round(payload.duration_seconds / 60),
          duration_seconds: payload.duration_seconds,
          category: payload.vr_tier || 'medium',
          vr_tier: payload.vr_tier,
          profile: payload.profile,
          mood_before: payload.mood_before,
          mood_after: payload.mood_after,
          completed: payload.completed ?? false,
          session_data: payload.session_data,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },

    async listSessions(userId, limit = 50, offset = 0, experienceType) {
      let query = supabase
        .from('vr_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (experienceType) {
        query = query.or(`experience_type.eq.${experienceType},experience_id.eq.${experienceType}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data ?? [];
    },

    async getSession(id, userId) {
      const { data, error } = await supabase
        .from('vr_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data ?? null;
    },

    async updateSession(id, userId, payload) {
      const updateData: Record<string, unknown> = { ...payload };
      // Map duration_seconds to duration_minutes for backwards compatibility
      if (payload.duration_seconds !== undefined) {
        updateData.duration_minutes = Math.round(payload.duration_seconds / 60);
      }

      const { data, error } = await supabase
        .from('vr_sessions')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data ?? null;
    },

    async deleteSession(id, userId) {
      const { error } = await supabase
        .from('vr_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    },

    async getStats(userId) {
      const { data, error } = await supabase
        .from('vr_sessions')
        .select('id, experience_type, experience_id, duration_seconds, duration_minutes, completed, mood_before, mood_after, created_at')
        .eq('user_id', userId);

      if (error) throw error;

      const sessions = data ?? [];
      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(s => s.completed).length;
      // Use duration_seconds if available, otherwise convert from duration_minutes
      const totalDuration = sessions.reduce((acc, s) => {
        if (s.duration_seconds) return acc + s.duration_seconds;
        if (s.duration_minutes) return acc + (s.duration_minutes * 60);
        return acc;
      }, 0);

      const experienceCount: Record<string, number> = {};
      for (const s of sessions) {
        const expType = s.experience_type || s.experience_id;
        if (expType) {
          experienceCount[expType] = (experienceCount[expType] || 0) + 1;
        }
      }

      const moodImprovement = sessions.filter(s => s.mood_before && s.mood_after);
      const avgMoodChange = moodImprovement.length > 0
        ? moodImprovement.reduce((acc, s) => acc + ((s.mood_after || 0) - (s.mood_before || 0)), 0) / moodImprovement.length
        : null;

      return {
        total_sessions: totalSessions,
        completed_sessions: completedSessions,
        completion_rate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
        total_duration_seconds: totalDuration,
        experiences_used: experienceCount,
        average_mood_change: avgMoodChange,
      };
    },

    async getExperiences() {
      return [
        {
          id: 'nebula',
          name: 'Nebula',
          description: 'Expérience immersive solo dans une nébuleuse cosmique',
          type: 'solo',
          duration_range: { min: 300, max: 1800 },
          features: ['relaxation', 'meditation', 'breath_sync'],
        },
        {
          id: 'dome',
          name: 'Dome',
          description: 'Espace VR collaboratif pour équipes',
          type: 'team',
          duration_range: { min: 600, max: 3600 },
          features: ['team_building', 'shared_experience', 'guided'],
        },
        {
          id: 'galaxy',
          name: 'Galaxy Explorer',
          description: 'Exploration galactique méditative',
          type: 'solo',
          duration_range: { min: 600, max: 2400 },
          features: ['exploration', 'wonder', 'ambient'],
        },
        {
          id: 'breath',
          name: 'VR Breath',
          description: 'Respiration guidée en environnement VR',
          type: 'solo',
          duration_range: { min: 180, max: 900 },
          features: ['breathwork', 'biofeedback', 'guided'],
        },
      ];
    },

    async getEnvironments() {
      const { data, error } = await supabase
        .from('vr_environments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data ?? [];
    },
  };
};

const ensureUser = (req: FastifyRequest, reply: FastifyReply) => {
  if (!(req as unknown as { user?: { sub: string } }).user) {
    reply.code(401).send({
      ok: false,
      error: { code: 'unauthorized', message: 'Unauthorized' },
    });
    return null;
  }
  return (req as unknown as { user: { sub: string } }).user;
};

export type VRRoutesOptions = {
  repository?: VRRepository;
};

export function registerVRRoutes(app: FastifyInstance, options: VRRoutesOptions = {}) {
  const repository = options.repository ?? createVRRepository();

  // POST /api/v1/vr/sessions - Créer une session VR
  app.post('/api/v1/vr/sessions', async (req: SessionRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = createSessionSchema.parse(req.body);
      const session = await repository.createSession(user.sub, data);
      reply.code(201).send({ ok: true, data: session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(422).send({
          ok: false,
          error: {
            code: 'validation_error',
            message: 'Invalid input',
            details: error.flatten(),
          },
        });
        return;
      }

      app.log.error({ error }, 'Unexpected error creating VR session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/vr/sessions - Liste des sessions VR
  app.get('/api/v1/vr/sessions', async (req: SessionListRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
      const experienceType = req.query.experience_type;

      const sessions = await repository.listSessions(user.sub, limit, offset, experienceType);
      reply.send({ ok: true, data: sessions });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching VR sessions');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/vr/sessions/:id - Détails d'une session VR
  app.get('/api/v1/vr/sessions/:id', async (req: SessionGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const session = await repository.getSession(id, user.sub);

      if (!session) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Session not found' },
        });
        return;
      }

      reply.send({ ok: true, data: session });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching VR session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // PATCH /api/v1/vr/sessions/:id - Mettre à jour une session VR
  app.patch('/api/v1/vr/sessions/:id', async (req: SessionUpdateRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const data = updateSessionSchema.parse(req.body);
      const session = await repository.updateSession(id, user.sub, data);

      if (!session) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Session not found' },
        });
        return;
      }

      reply.send({ ok: true, data: session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(422).send({
          ok: false,
          error: {
            code: 'validation_error',
            message: 'Invalid input',
            details: error.flatten(),
          },
        });
        return;
      }

      app.log.error({ error }, 'Unexpected error updating VR session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // DELETE /api/v1/vr/sessions/:id - Supprimer une session VR
  app.delete('/api/v1/vr/sessions/:id', async (req: SessionGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      await repository.deleteSession(id, user.sub);
      reply.code(204).send();
    } catch (error) {
      app.log.error({ error }, 'Unexpected error deleting VR session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/vr/stats - Statistiques VR
  app.get('/api/v1/vr/stats', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const stats = await repository.getStats(user.sub);
      reply.send({ ok: true, data: stats });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching VR stats');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/vr/experiences - Liste des expériences VR disponibles
  app.get('/api/v1/vr/experiences', async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const experiences = await repository.getExperiences();
      reply.send({ ok: true, data: experiences });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching VR experiences');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/vr/environments - Liste des environnements VR générés
  app.get('/api/v1/vr/environments', async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const environments = await repository.getEnvironments();
      reply.send({ ok: true, data: environments });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching VR environments');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/vr/profiles/default - Profils VR par défaut
  app.get('/api/v1/vr/profiles/default', async (_req: FastifyRequest, reply: FastifyReply) => {
    const profiles = {
      breath: {
        module: 'vr_breath',
        comfort: 'medium',
        duration: 'normal',
        locomotion: 'smooth',
        fov: 'default',
        audio: 'soft',
        guidance: 'none',
        vignette: 'soft',
        bloom: true,
        particles: 'medium',
        fallback2dNext: false,
      },
      galaxy: {
        module: 'vr_galaxy',
        comfort: 'medium',
        duration: 'normal',
        locomotion: 'smooth',
        fov: 'default',
        audio: 'soft',
        guidance: 'none',
        vignette: 'soft',
        bloom: true,
        particles: 'medium',
        fallback2dNext: false,
        navigation: 'cruise',
        stellarDensity: 'lush',
      },
    };

    reply.send({ ok: true, data: profiles });
  });
}
